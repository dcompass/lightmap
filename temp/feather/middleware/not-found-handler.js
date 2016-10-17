/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import errors from 'feathers-errors';
module.exports = function () {
  return function (req, res, next) {
    next(new errors.NotFound('Page not found'));
  };
};
