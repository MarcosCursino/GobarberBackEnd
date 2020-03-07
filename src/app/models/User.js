import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Criptografa a senha, usamos o hook beforeSave para sempre que criar ou editar (atualizar)
    // Pega o campo virtual, criptgrafa e joga o valor para a variavel de  hash

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // belongsTo = pertece à
  // as: = é um codinome

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // compara os valores
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
