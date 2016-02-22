'use strict';

module.exports = function ClarifyError(obj) {
  Error.captureStackTrace(this, this.constructor);
  Object.assign(this, obj);
  this.name = this.constructor.name;
  this.message = obj.message;
};

require('util').inherits(module.exports, Error);
