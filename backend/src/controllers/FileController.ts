import { getConnection } from 'typeorm';
import { Response, Request } from 'express';

class FileController {
  static async store(req: Request, res: Response) {
    return res.json(req.file);
  }
}

export default FileController;
