const { Markup } = require('telegraf');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const store = require('../../store');
const { saveToSession } = require('../util/session');

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx) => {
  // check if user click button 'Log In via Telegram' on Web
  if (!ctx.startPayload) {
    return ctx.reply('Войдите через сайт http://localhost:3000/');
  }

  const sessionID = ctx.startPayload;
  if (!store.socketsByUserSessionToken[sessionID]) {
    return await ctx.reply(ctx.i18n.t('scenes.start.no_session_id'));
  } else {
    const { id, username, first_name, last_name } = ctx.update.message.from;
    // save to session sessionID and current user
    saveToSession(ctx, 'sessionID', sessionID);
    saveToSession(ctx, 'currentUser', { id, username, first_name, last_name });
    const candidate = await User.findOne({ username });

    let message = '';
    if (candidate) {
      // user already exist
      console.log(`Такой пользователь уже существует ${candidate.id} --> ${candidate.username}!`);
      message = ctx.i18n.t('scenes.start.logIn.existed_user', { first_name, last_name });
    } else {
      // user registration
      console.log(`Регистрируем нового пользователя ${username}`);
      const user = new User({
        username: username,
        telegramId: id,
        firstName: first_name,
        lastName: last_name,
      });
      await user.save();
      message = ctx.i18n.t('scenes.start.logIn.new_user', { first_name, last_name });
    }

    // go to another controller (acceptLogin or declineLogin)
    return await ctx.reply(
      message,
      Markup.keyboard([
        ctx.i18n.t('keyboards.start.accept'),
        ctx.i18n.t('keyboards.start.decline'),
      ]).oneTime().resize().extra());
  }
});

module.exports = start;
