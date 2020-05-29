import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

import User from '../database/entity/User';
import Notification from '../database/schemas/Notification';

interface NewRequest extends Request {
  userId: any;
}

export default class NotificationController {
  static async index(req: NewRequest, res: Response) {
    const userRepository = getConnection().getRepository(User);

    const checkUserProvider = await userRepository.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ message: 'Apenas provedores podem ler as notificações' });
    }

    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json({ data: notifications });
  }

  static async update(req: NewRequest, res: Response) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json({ data: notification });
  }
}
