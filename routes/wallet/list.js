const Wallet = require('../../models/Wallet');
const User = require('../../models/User');

module.exports = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ telegramId: id });
    const wallets = user.wallets;

    res.status(200).json({ wallets });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};
