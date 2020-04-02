import Sequelize, { Model } from 'sequelize';

// |> Classe é herdada da classe Model do sequelize
class Courier extends Model {
  // |> Método estático que será chamado automaticamente pelo sequelize
  static init(sequelize) {
    // |> Método super.init da classe pai Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Courier;
