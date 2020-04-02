import 'dotenv/config';

import express from 'express';
import routes from './routes';

// |> Importa o arquivo de database para realizar a conexão com o BD
import './database';

class App {
  // |> Método constructor()
  //    executado automaticamente quando a classe é instanciada
  constructor() {
    // |> Variavel server
    //    recebe o express
    this.server = express();

    // |> Chama os demais métodos da classe App
    this.middlewares();
    this.routes();
  }

  // |> Método middlewares
  //    onde serão definidos todos os middlewares da app
  middlewares() {
    // |> Para enviar/receber requisições no formato JSON
    this.server.use(express.json());
  }

  routes() {
    // |> Rotas estão definidas no arquivo routes.js
    //    são importadas na variavel routes
    this.server.use(routes);
  }
}

// |> Exporta uma nova instancia da classe App
//    no caso, apenas o server será exportado
export default new App().server;
