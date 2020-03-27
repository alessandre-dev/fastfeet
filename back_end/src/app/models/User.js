import Sequelize, { Model } from 'sequelize';

// |> bcrypt para gerar hash da senha
import bcrypt from 'bcryptjs';

// |> Classe é herdada da classe Model do sequelize
class User extends Model {
  // |> Método estático que será chamado automaticamente pelo sequelize
  static init(sequelize) {
    // |> Método super.init da classe pai Model
    super.init(
      {
        // |> 1º parâmetro
        //    objeto com todas as colunas
        //    enviar as colunas que serão inseridas pelo usuário
        //    evitar as chaves primárias, estrangeiras ou as created_at e updated_at
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // |> campo virtual não existe na tabela
        password_hash: Sequelize.STRING,
      },
      {
        // |> 2º parâmetro da super.init
        //    objeto contendo o parâmetro sequelize do método static init
        sequelize,
      }
    );

    // |> Hooks são trechos de códigos executados automaticamente
    //    pelo sequelize => ações/eventos
    //    beforeSave => será executado antes do save
    this.addHook('beforeSave', async user => {
      // |> Se a senha for informada
      //    Então é gerado o hash com o bcrypt
      //    parâmetro 8 => força criptografia
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // |> Método para validar a senha informada
  checkPassword(password) {
    // |> Método bcrypt.compare => retorna true quando são iguais
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
