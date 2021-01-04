const { Schema, model } = require('mongoose');

const walletSchema = new Schema({
  name: { type: String },
  address: { type: String, required: true },
  type: { type: String, required: true },
  owner: { type: Schema.ObjectId, ref: 'User', autopopulate: true },
  isActivated: { type: Boolean, default: false },
});

walletSchema.plugin(require('mongoose-autopopulate'));

module.exports = Wallet = model('Wallet', walletSchema)
