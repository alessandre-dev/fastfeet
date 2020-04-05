import Sequelize, { Model } from 'sequelize';

// |> Classe é herdada da classe Model do sequelize
class Delivery extends Model {
  // |> Método estático que será chamado automaticamente pelo sequelize
  static init(sequelize) {
    // |> Método super.init da classe pai Model
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // Relacionamento dos campos recipient_id, deliveryman_id e signature_id
  static associate(models) {
    this.belongsTo(models.Recipient, { foreignKey: 'recipient_id', as: 'recipient' });
    this.belongsTo(models.Courier, { foreignKey: 'deliveryman_id', as: 'deliveryman' });
    this.belongsTo(models.File, { foreignKey: 'signature_id', as: 'signature' });
  }
}

export default Delivery;
