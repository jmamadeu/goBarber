import * as Yup from 'Yup';
import pt from 'date-fns/locale/pt';
import { getConnection } from 'typeorm';
import { Response, Request } from 'express';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import Queue from '../libs/Queue';
import CancellationMail from '../jobs/CancellationMail';

import User from '../database/entity/User';
import Appointment from '../database/entity/Appointment';
import Notification from '../database/schemas/Notification';

interface NewRequest extends Request {
  userId: any;
}

export default class AppointmentController {
  static async index(req: NewRequest, res: Response) {
    const appointmentRepository = getConnection().getRepository(Appointment);

    let { page = 1 } = req.query;

    const init = (Number(page) - 1) * 20;

    const appointments = await appointmentRepository.find({
      where: { user: req.userId, canceledAt: null },
      relations: ['provider', 'provider.avatar'],
      order: { date: 'ASC' },
      skip: init,
      take: 20,
    });

    // const appointments = await appointmentRepository
    //   .createQueryBuilder('appointment')
    //   .innerJoinAndSelect('appointment.provider', 'provider')
    //   .leftJoinAndSelect('provider.avatar', 'avatar')
    //   .getMany();

    return res.json({ data: appointments });
  }

  static async store(req: NewRequest, res: Response) {
    try {
      const schema = Yup.object().shape({
        provider: Yup.string().required(),
        date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ message: 'Aconteceu um erro na validação!' });
      }

      const appointmentRepository = getConnection().getRepository(Appointment);
      const userRepository = getConnection().getRepository(User);

      const { provider, date } = req.body;

      const isProvider = await userRepository.findOne({
        where: { id: provider, provider: true },
      });

      if (!isProvider) {
        return res.status(401).json({
          message:
            'Você não pode criar um agendamento, para um usuario que não é provedor do serviço!',
        });
      }

      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(400).json({
          message: 'Não pode ser marcado um agendamento para um dia passado!',
        });
      }

      const checkAvailability = await appointmentRepository.findOne({
        where: { provider, canceledAt: null, date: hourStart },
      });

      if (checkAvailability) {
        return res.status(400).json({
          message:
            'A data solicitada não está disponível, ou seja já existe um agendamento!',
        });
      }

      const appointment = appointmentRepository.create({
        date: hourStart,
        provider,
        user: req.userId,
      });

      await appointmentRepository.save(appointment);

      const user = await userRepository.findOne({ where: { id: req.userId } });

      const formattedDate = format(
        parseISO(date),
        "'dia' dd 'de' MMMM', às' H:mm'h '",
        {
          locale: pt,
        }
      );

      await Notification.create({
        content: `Novo Agendameno de ${user.name} para ${formattedDate}`,
        user: provider,
      });

      return res.json({ data: appointment });
    } catch (err) {
      console.log();

      return res.status(400).json({
        message: `Aconteceu algum erro, tente novamente: ${err.message}`,
      });
    }
  }

  static async delete(req: NewRequest, res: Response) {
    const appointmentRepository = getConnection().getRepository(Appointment);
    const userRepository = getConnection().getRepository(User);

    const appointment = await appointmentRepository.findOne({
      where: { id: req.params.id },
      relations: ['user', 'provider'],
    });

    if (appointment.user.id !== req.userId) {
      return res
        .status(401)
        .json({ message: 'Você não pode cancelar este agendamento' });
    }

    const dateWithSub = subHours(appointment.date, 2);

    // if (isBefore(dateWithSub, new Date())) {
    //   return res.status(401).json({
    //     message: 'Você não pode cancelar o agendamento duas horas depois',
    //   });
    // }

    appointment.canceledAt = new Date();

    appointmentRepository.save(appointment);

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json({ data: appointment });
  }
}
