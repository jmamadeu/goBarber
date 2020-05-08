import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import authConfig from '../configs/auth';

interface NewRequest extends Request {
  userId: string;
}

export default async (req: NewRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não enviado!' });
  }

  try {
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ message: 'Token mal formado!' });
    }

    const decoded = <any>jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido!' });
  }
};
