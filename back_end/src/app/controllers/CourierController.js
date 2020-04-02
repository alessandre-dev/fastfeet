// |> Importação da lib Yup para validação de dados
import * as Yup from 'yup';

// |> Importação dos Models
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  // |> Store => Cadastro de entregadores
  async store(req, res) {
    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Desestruturação do courier
    //    para retornar apenas os campos necessários para o front-end
    // |> Método create para cadastrar os dados do entregador
    const {
      id,
      name,
      email,
    } = await Courier.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // |> Update => Alteração de entregadores
  async update(req, res) {
    // |> Localiza o destinatário pelo ID
    const couriers = await Courier.findByPk(req.params.id);

    if (!couriers) {
      return res.status(400).json({ error: 'Courier does not exists' });
    }

    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Desestruturação do entregador
    //    para retornar apenas os campos necessários para o front-end
    // |> Método update para alterar os dados do entregador
    const {
      id,
      name,
      email,
    } = await couriers.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // |> Index => Listagem de entregadores
  async index(req, res) {
    const couriers = await Courier.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(couriers);
  }

  // |> Delete => Remoção de entregadores
  async delete(req, res) {
    const couriers = await Courier.findByPk(req.params.id);

    await couriers.destroy();

    return res.json(couriers);
  }
}

export default new CourierController();
