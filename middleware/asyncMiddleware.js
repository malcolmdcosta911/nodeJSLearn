function asyncMiddleware(handler) {
  return async (req, res, next) => {
    //return function refrence
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = asyncMiddleware;

//done by require('express-async-errors') instead
