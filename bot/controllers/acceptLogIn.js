const { Extra } = require('telegraf');
const jwt = require('jsonwebtoken');
const config = require('config');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const store = require('../../store');
const { deleteFromSession } = require('../util/session');

const { leave } = Stage;
const acceptLogIn = new Scene('acceptLogIn');

acceptLogIn.enter(async (ctx) => {
  const { sessionID, currentUser } = ctx.session;
  store.socketsByUserSessionToken[sessionID] && store.socketsByUserSessionToken[sessionID].forEach(socket => {
    jwt.sign({ id: currentUser.id }, config.get('jwtSecret'), {expiresIn: 60 * 60 * 24 * 60}, (err, token) => {
      store.io.to(socket.id).emit('login', { token });
    });
  });

  deleteFromSession(ctx, 'sessionID');
  deleteFromSession(ctx, 'current_user');
  return await ctx.reply(ctx.i18n.t('scenes.accept.description'), Extra.markup((m) => m.removeKeyboard()));
});

module.exports = acceptLogIn;
