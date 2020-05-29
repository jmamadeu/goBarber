import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

import User from '../database/entity/User';

class ProviderController {
  static async index(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    // const providers = await userRepository.find({
    //   select: ['id', 'name', 'email'],
    //   relations: ['avatar'],
    //   where: { provider: true },
    // });

    const providers = await userRepository.find({
      select: ['id', 'name', 'email'],
      where: { provider: true },
      join: {
        alias: 'user',
        innerJoinAndSelect: {
          avatar: 'user.avatar',
        },
      },
    });

    return res.json({
      data: providers,
      message: 'Provedores carregados com sucesso!',
    });
  }
}

export default ProviderController;
