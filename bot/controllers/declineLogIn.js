const { Extra } = require('telegraf');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const store = require('../../store');
const { deleteFromSession } = require('../util/session');

const { leave } = Stage;
const declineLogIn = new Scene('declineLogIn');

declineLogIn.enter(async (ctx) => {
  const { sessionID } = ctx.session;
  store.socketsByUserSessionToken[sessionID] && store.socketsByUserSessionToken[sessionID].forEach(socket => {
    store.io.to(socket.id).emit('forceLogOut');
  });

  deleteFromSession(ctx, 'sessionID');
  deleteFromSession(ctx, 'current_user');
  return await ctx.reply(ctx.i18n.t('scenes.decline.description'), Extra.markup((m) => m.removeKeyboard()));
});

module.exports = declineLogIn;
