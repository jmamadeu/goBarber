import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import * as Yup from 'yup';

import User from '../database/entity/User';

interface NewRequest extends Request {
  userId: string;
}

class UserController {
  static async update(req: NewRequest, res: Response) {
    const userRepository = getConnection().getRepository(User);

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field,
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field,
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Erro na validação dos campos!' });
    }

    const { email, oldPassword } = req.body;

    let user = await userRepository.findOne({
      where: { id: req.userId },
      relations: ['avatar'],
    });

    if (email !== user.email) {
      const userExists = await userRepository.findOne({ where: { email } });

      if (userExists) {
        return res
          .status(400)
          .json({ message: 'Já existe um usuário com este email!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ message: 'Palavra passe incorrecta!' });
    }

    if (oldPassword) {
      const { password } = req.body;
      user = { passwordHash: password, ...req.body };
    }

    user = { ...user, ...req.body };

    await userRepository.save(user);

    return res.json({ data: { ...user, passwordHash: undefined } });
  }

  static async index(_, res: Response) {
    const userRepository = getConnection().getRepository(User);

    let users = await userRepository.find({
      relations: ['avatar'],
      // join: {
      //   alias: 'user',
      //   innerJoinAndSelect: {
      //     appointments: 'user.appointments',
      //   },
      // },
    });

    users = users.map(user => Object.assign(user, { passwordHash: undefined }));

    return res.json({ data: users });
  }

  static async store(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ message: 'Erro na validação dos campos!' });
      }

      const userRepository = getConnection().getRepository(User);
      let userExists = await userRepository.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(409).json({
          message: 'Usuário já existe!',
          status: 409,
        });
      }

      let data = {
        ...req.body,
        passwordHash: req.body.password,
        password: undefined,
      };

      let user = userRepository.create(data);
      await userRepository.save(user);

      user = Object.assign(user, { passwordHash: undefined });

      return res.json({
        data: user,
        message: 'Usuário cadastrado com sucesso!',
        status: 201,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
        status: 400,
      });
    }
  }
}

export default UserController;
