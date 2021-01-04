const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  wallets: {
    tron: [{ type: Schema.ObjectId, ref: 'Wallet', autopopulate: true }],
    btc: [{ type: Schema.ObjectId, ref: 'Wallet', autopopulate: true }],
    erc20: [{ type: Schema.ObjectId, ref: 'Wallet', autopopulate: true }],
  },
});

userSchema.plugin(require('mongoose-autopopulate'));

module.exports = User = model('User', userSchema);
