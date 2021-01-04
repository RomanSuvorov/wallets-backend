const Wallet = require('../../models/Wallet');

module.exports = async (req, res) => {
  try {
    const address = req.params.address;
    const wallet = await Wallet.findOne({ address });
    if (!wallet) return res.status(200).json({});

    res.status(200).json({ wallet });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};
