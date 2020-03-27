// |> Importação de módulo jwt
import jwt from 'jsonwebtoken';

// |> Importação da lib Yup para validação de dados
import * as Yup from 'yup';

// |> Importação das configurações de autenticação
import authConfig from '../../config/auth';

// |> Importação do Model de Usuários
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Campos email e senha
    //    utilizados para autenticação do usuário
    const { email, password } = req.body;

    // |> Verifica se existe um usuário com email informado
    //    se não existir, retorna o erro para o front-end
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // |> Verifica se a senha informada é a mesma cadastrada
    //    se não for, retorna o erro para o front-end
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // |> Dados do usuário para retornar ao iniciar a sessão
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // |> Token gerado com o jwt
      //    1º parâmetro => objeto contendo informações adicionais
      //                    no caso o id do usuário
      //    2º parâmetro => segredo para geração do token
      //                    importado do arquivo \config\auth.js
      //    3º parâmetro => objeto com configurações do token
      //                    expiresIn => data de expiração (7 dias)
      //                    importado do arquivo \config\auth.js
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
