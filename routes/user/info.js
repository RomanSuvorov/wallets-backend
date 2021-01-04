const User = require('../../models/User');

module.exports = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ telegramId: id });
    const { firstName, lastName, telegramId, username } = user;
    res.status(200).json({ firstName, lastName, telegramId, username });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};
