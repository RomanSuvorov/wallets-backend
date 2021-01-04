const { validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации',
      });
    }

    const { username, id } = req.body;
    const candidate = await User.findOne({ username });

    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' });
    }
    const hashedId = await bcrypt.hash(id, 12);
    const user = new User({ username, id: hashedId });

    await user.save();

    res.json({ id: user.id, username: user.username });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};
