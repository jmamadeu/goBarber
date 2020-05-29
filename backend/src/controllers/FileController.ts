import { getConnection } from 'typeorm';
import { Response, Request } from 'express';

import File from '../database/entity/File';

class FileController {
  static async store(req: Request, res: Response) {
    const fileRepository = getConnection().getRepository(File);

    const { originalname: name, filename: path } = req.file;

    const file = fileRepository.create({ name, path });

    await fileRepository.save(file);
    return res.json({ data: file, message: 'Arquivo salvo com sucesso!' });
  }
}

export default FileController;
