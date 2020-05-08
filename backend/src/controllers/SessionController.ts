import { Response, Request } from 'express';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../database/entity/User';
import authConfig from '../configs/auth';

class SessionController {
  static async store(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    const { email, password } = req.body;

    let user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não existe!' });
    }

    if (!user.checkPassword(password)) {
      return res.status(401).json({ message: 'Palavra passe inválida!' });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expires,
    });

    return res.json({
      data: { id: user.id, name: user.name, email: user.email },
      token,
    });
  }
}

export default SessionController;
