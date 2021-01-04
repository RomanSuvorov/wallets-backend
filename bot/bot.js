const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n')
const { match } = require('telegraf-i18n');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const config = require('config');
const path = require('path');

const User = require('../models/User');
const asyncWrapper = require('./util/error-handler');
const startScene = require('./controllers/start');
const acceptLogInScene = require('./controllers/acceptLogIn');
const declineLogInScene = require('./controllers/declineLogIn');

const bot = new Telegraf(config.get('telegramBotToken'));
const stage = new Stage([
  startScene,
  acceptLogInScene,
  declineLogInScene,
]);

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  directory: path.resolve(__dirname, 'locales'),
  useSession: true,
  allowMissing: false,
  sessionName: 'session'
});

bot.use(i18n.middleware());
bot.use(session());
bot.use(stage.middleware());
// bot.use(Telegraf.log());

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType},`, err)
});

bot.start(asyncWrapper(async (ctx) => ctx.scene.enter('start')));

bot.hears(
  match('keyboards.start.accept'),
  asyncWrapper(async (ctx) => await ctx.scene.enter('acceptLogIn')),
);

bot.hears(
  match('keyboards.start.decline'),
  asyncWrapper(async (ctx) => await ctx.scene.enter('declineLogIn')),
);

bot.hears(
  match('keyboards.back'),
  asyncWrapper(async (ctx) => await ctx.scene.enter('declineLogIn')),
);

bot.command('delete_itself', async (ctx) => {
  const { id, username } = ctx.update.message.from;

  const candidate = await User.findOne({ username });

  if (!candidate) {
    return ctx.reply('Ошибка. Юзер для чистки не найден');
  }

  User.findOneAndDelete({ telegramId: candidate.id }).then(() => {
    return ctx.reply(`Пользователь ${username} удален.`);
  });
});

module.exports = bot;
