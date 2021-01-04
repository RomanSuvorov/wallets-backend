const Wallet = require('../../models/Wallet');
const User = require('../../models/User');

module.exports = async (req, res) => {
  try {
    const id = req.user.id;
    const { address, type, name } = req.body;
    const user = await User.findOne({ telegramId: id });

    const newWallet = new Wallet({ name, type, address, owner: user._id });
    await newWallet.save();

    user.wallets[type].push(newWallet);
    await user.save();

    res.status(200).json({ wallet: newWallet });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};
