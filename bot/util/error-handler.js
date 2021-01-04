const asyncWrapper = fn => {
  return async (ctx, next) => {
    try {
      return await fn(ctx);
    } catch (error) {
      console.log('asyncWrapper error, %0', error);
      await ctx.reply('Something went wrong');
      return next();
    }
  };
};

module.exports = asyncWrapper;
