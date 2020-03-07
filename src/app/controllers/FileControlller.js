import File from '../models/File';

class FileController {
  async store(req, res) {
    // Conceito de desestruturação, pegando apenas o que precisamenos do req.files e mudando o nome
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}
export default new FileController();
