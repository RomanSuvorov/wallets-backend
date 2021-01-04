const store = {
  app: null,
  io: null,
  sockets: {},
  socketIds: [],
  socketsByUserSessionToken: {},
  socketsByUserID: {},
  userIDsBySocketID: {},
};

module.exports = store;
