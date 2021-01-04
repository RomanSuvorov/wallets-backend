const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const store = require('./store');
const events = require('./events');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const router = require('./routes');

module.exports = () => {
  store.io.sockets
    .on('connection', (socket) => {
    store.socketIds.push(socket.id);
    store.sockets[socket.id] = socket;

    socket.on('prepare', ({ sessionID }) => {
      console.log('prepare', sessionID);

      if (!store.socketsByUserSessionToken[sessionID]) store.socketsByUserSessionToken[sessionID] = [];
      store.socketsByUserSessionToken[sessionID].push(socket);

      const removeSocket = (array, element) => {
        let result = [...array];
        let i = 0;
        let found = false;
        while (i < result.length && !found) {
          if (element.id === array[i].id) {
            result.splice(i, 1);
            found = true;
          }
          i++;
        }
        return result;
      };

      socket
        .on('authenticate', async ({ token }) => {
          console.log('authenticate');
          const { id: telegramId } = jwt.decode(token, config.get('jwtSecret'));
          const candidate = await User.findOne({ telegramId });
          if (!candidate) {
            socket.emit('unauthenticated');
            console.log('User with id ', telegramId, ' was not found!');
            return;
          }

          console.log(`Socket authenticated: ${telegramId}`);

          events.forEach(event => socket.on(event.tag, data => event.callback(socket, data, telegramId)));

          socket.emit('authenticated', { token })
        })
        .on('disconnect', () => {
          store.socketIds.splice(store.socketIds.indexOf(socket.id), 1);
          store.sockets[socket.id] = undefined;
          store.socketsByUserSessionToken[sessionID] = removeSocket(store.socketsByUserSessionToken[sessionID], socket);
        });
    });
  });

  store.app.use(cors());
  store.app.use('/api', router);

  const mongooseConnect = () => {
    try {
      mongoose.connect(config.get('mongoUri'), {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    } catch (e) {
      console.log('Server Error', e.message);
      process.exit(1);
    }
  }

  mongooseConnect();
};
