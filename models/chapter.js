'use strict';
const moment = require('moment');
module.exports = {
  schema: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    book: {
      type: String,
      required: true
    }
  },
  indexes: [{
    book: 1,
    createdAt: -1
  }],
  pre: {
    validate: validate
  }
};


/**
 * [validate description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function validate(next) {
  /*jshint validthis:true */
  let self = this;
  if (!self.createdAt) {
    self.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  next();
}
