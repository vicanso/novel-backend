'use strict';
const moment = require('moment');


module.exports = {
  schema: {
    name: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    latestUpdatedAt: {
      type: String,
      required: true
    },
    tags: Array,
    cover: String,
    chapters: [],
    sources: []
  },
  pre: {
    validate: validate
  }
};


function validate(next) {
  /*jshint validthis:true */
  let self = this;
  if (!self.createdAt) {
    self.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  self.latestUpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  self.tags = self.tags || [];
  next();
}
