import Sequelize, { Model } from 'sequelize';

// |> Classe é herdada da classe Model do sequelize
class Recipient extends Model {
  // |> Método estático que será chamado automaticamente pelo sequelize
  static init(sequelize) {
    // |> Método super.init da classe pai Model
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
