async function sendMessage({socket, message, data}) {
  try {
    return socket.emit(message, data);
  } catch (e) {
    throw e;
  }
}

module.exports = sendMessage;
