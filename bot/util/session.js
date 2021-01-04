function saveToSession(ctx, field, data) {
  ctx.session[field] = data;
}

function deleteFromSession(ctx, field) {
  delete ctx.session[field];
}

module.exports = { saveToSession, deleteFromSession };
