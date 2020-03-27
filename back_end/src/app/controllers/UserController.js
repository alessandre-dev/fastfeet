// |> Importação da lib Yup para validação de dados
import * as Yup from 'yup';

// |> Importação do Model User
import User from '../models/User';

class UserController {
  // |> Store => Cadastro de usuários
  async store(req, res) {
    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Variável userExists
    //    verifica se já existe um usuário com o mesmo email cadastrado
    //    método findOne para encontrar um registro
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // |> Se existir um usuário (retorna para o front-end)
    //    retorna um erro status 400 => Bad request
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // |> Desestruturação do user
    //    para retornar apenas os campos necessários para o front-end
    // |> Método create para cadastrar os dados do usuário
    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // |> Update => Alteração de usuários
  async update(req, res) {
    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    // |> Localiza o usuário pelo ID (middleware de autenticação)
    const user = await User.findByPk(req.userId);

    // |> Verifica se o usuário pretende alterar o email
    //    se for informado um email
    //    e o email for diferente do cadastrado
    if (email && email !== user.email) {
      // |> Variável userExists
      //    verifica se já existe um usuário com o mesmo email cadastrado
      const userExists = await User.findOne({ where: { email } });

      // |> Se existir um usuário (retorna para o front-end)
      //    retorna um erro status 400 => Bad request
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // |> Verifica se o usuário pretende alterar a senha
    //    se for informado o oldpassword
    //    e não bater com a senha cadastrada
    //    retorna um erro para o front-end
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // |> Desestruturação do user
    //    para retornar apenas os campos necessários para o front-end
    // |> Método update para alterar os dados do usuário
    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
