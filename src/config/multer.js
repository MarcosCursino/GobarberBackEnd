import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// Salvar imagem com o multer
// Entramos na pastas para salvar,e vamos mudar o filename com 16bits
// se o cb nao der erro  alteramos o nome

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
