const express = require('express');
const http = require('http');
const cors = require('cors');
const io = require('socket.io');
const config = require('config');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bot = require('./bot/bot');
const store = require('./store');
const init = require('./init');

bot.launch();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: true,
}))
app.use(logger('dev'));
app.use(express.json({ extended: true }));
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'react', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'react', 'build', 'index.html'));
  })
}

const server = http.createServer(app);
store.app = app;
store.io = io(server, { cors: true });
init();

const PORT = config.get('port') || 5000;
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Specified port unavailable, retrying in 10 seconds...');
    setTimeout(() => {
      server.close();
      server.listen(config.get('port'));
    }, config.get('retryAfter'));
  }
});
server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
