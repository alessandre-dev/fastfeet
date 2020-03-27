// |> Importação da lib Yup para validação de dados
import * as Yup from 'yup';

// |> Importação do Model Recipient
import Recipient from '../models/Recipient';

class RecipientController {
  // |> Store => Cadastro de destinatários
  async store(req, res) {
    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Desestruturação do recipient
    //    para retornar apenas os campos necessários para o front-end
    // |> Método create para cadastrar os dados do destinatário
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  // |> Update => Alteração de destinatários
  async update(req, res) {
    // |> Localiza o destinatário pelo ID
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    // |> Variável schema
    //    irá validar o objeto (req.body)
    //    shape define o formato que o objeto deverá ter
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    // |> Verifica se o req.body é valido conforme o schema
    //    caso contrário retorna erro para o front-end
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    // |> Desestruturação do destinatário
    //    para retornar apenas os campos necessários para o front-end
    // |> Método update para alterar os dados do destinatário
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();
