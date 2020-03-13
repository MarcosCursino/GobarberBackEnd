import User from '../models/User';
import Notification from '../schema/Notification';

class NotificationController {
  async index(req, res) {
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkisProvider) {
      return res.status(400).json({ error: 'Error provider ' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort('createAt')
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
