const Wallet = require('../../models/Wallet');
const User = require('../../models/User');

module.exports = async (req, res) => {
  try {
    const _id = req.params.id;
    const wallet = await Wallet.findOne({ _id });
    if (!wallet) return res.status(500).json({ message: 'Something went wrong. Try again.' });

    wallet.isActivated = true;
    await wallet.save();

    res.status(200).json({ wallet });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};
