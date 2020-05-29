import { getConnection, Between } from 'typeorm';
import { Request, Response } from 'express';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Appointment from '../database/entity/Appointment';
import User from '../database/entity/User';

interface NewRequest extends Request {
  userId: any;
}

export default class ScheduleController {
  static async index(req: NewRequest, res: Response) {
    const appointmentRepository = getConnection().getRepository(Appointment);
    const userRepository = getConnection().getRepository(User);

    const checkProvider = await userRepository.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkProvider) {
      return res.status(401).json({ message: 'Você não é provedor !' });
    }
    const parseDate = parseISO(String(req.query.date));

    const appointment = await appointmentRepository.find({
      where: {
        date: Between(startOfDay(parseDate), endOfDay(parseDate)),
        canceledAt: null,
      },
      relations: ['user'],
    });

    return res.json({ data: appointment });
  }
}
