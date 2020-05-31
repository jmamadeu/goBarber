import { getConnection } from 'typeorm';
import { Response, Request } from 'express';

import File from '../database/entity/File';
import User from '../database/entity/User';

interface NewRequest extends Request {
  userId: string;
}

class FileController {
  static async store(req: NewRequest, res: Response) {
    const fileRepository = getConnection().getRepository(File);
    const userRepository = getConnection().getRepository(User);

    const { originalname: name, filename: path } = req.file;

    const user = await userRepository.findOne(req.userId);

    let file = await fileRepository.findOne({ where: { user: user } });

    if (file) {
      file.name = name;
      file.path = path;
    } else {
      file = fileRepository.create({ name, path, user });
    }

    await fileRepository.save(file);
    return res.json({ data: file, message: 'Arquivo salvo com sucesso!' });
  }
}

export default FileController;
