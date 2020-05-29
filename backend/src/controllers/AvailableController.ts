import {
  startOfDay,
  endOfDay,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { getConnection, Between } from 'typeorm';

import { Request, Response } from 'express';

import Appointment from '../database/entity/Appointment';

export default class AvailableController {
  static async index(req: Request, res: Response) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Data inválida!' });
    }

    const appointmentRepository = getConnection().getRepository(Appointment);

    const searchDate = parseInt(String(date));

    const appointments = await appointmentRepository.find({
      where: {
        provider: req.params.id,
        canceledAt: null,
        date: Between(startOfDay(searchDate), endOfDay(searchDate)),
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, Number(hour)), Number(minute)),
        0
      );

      return {
        time,
        value: format(value, `yyyy-MM-dd'T'HH:mm:ssxxx`),
        available:
          isAfter(value, new Date()) &&
          !appointments.find((a) => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json({ data: available });
  }
}
