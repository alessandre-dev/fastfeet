import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Courier from '../app/models/Courier';
import File from '../app/models/File';

import databaseConfig from '../config/database';

// |> Variável models => array de todos os models da aplicação
const models = [User, Recipient, Courier, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // |> Variável connection realiza a conexão com o database
    //    recebendo as configurações definidas em /config/database
    this.connection = new Sequelize(databaseConfig);

    // |> Map para percorrer o array dos models
    //    no método init() de cada model passa a variável de conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

// |> Classe Database() é exportada para o arquivo app.js
export default new Database();
