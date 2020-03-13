import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schema/Notification';

// Agendamento de Serviço
class AppointmentController {
  /**
   * Listar agendamentos de usuarios logados
   * Index Metodo de listagem padrão
   */
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }
    const { provider_id, date } = req.body;

    // Checar se e um provedor

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appoints with' });
    }

    /**
     * Transforma em obj date, e zerar o minutos e segundos
     * Isbefore Checar se a hota de inicio e menor do que hora atual
     */

    const houreStart = startOfHour(parseISO(date));

    if (isBefore(houreStart, new Date())) {
      return res.status(400).json({ error: 'Past Date are not permited' });
    }

    /**
     * Verificar se o agendador não tem u agendamento no msm horario
     */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: houreStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appintmente date is note available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      houreStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
