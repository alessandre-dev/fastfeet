// |> Middleware de Autenticação

// |> Importação de módulo jwt
import jwt from 'jsonwebtoken';

// |> Importação promisify da lib padrão util do node
//    transforma uma função de callback
//    para poder usar o async e await
import { promisify } from 'util';

// |> Importação das configurações de autenticação
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // |> Variável recebe o token enviado pelo cabeçalho da requisição
  const authHeader = req.headers.authorization;

  // |> Verifica se foi informado o token
  //    caso contrário, retorna o erro para o front-end
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // |> Separa (split) a string do token
  //    palavra Bearer (espaço) token
  const [, token] = authHeader.split(' ');

  try {
    // |> decoded é o valor retornado pela função jwt.verify
    //    promissify retorna uma outra função ()
    //    são informados os parâmetros token e o segredo usado na geração
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // |> ID do usuário (payload do token)
    req.userId = decoded.id;

    // |> Next para seguir fluxo da aplicação
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
