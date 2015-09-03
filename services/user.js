'use strict';
const mongodb = localRequire('helpers/mongodb');
const uuid = require('node-uuid');

exports.create = create;
exports.get = get;

/**
 * [create description]
 * @return {[type]} [description]
 */
function* create() {
  let User = mongodb.model('User');
  let data = {
    id: uuid.v4(),
    name: '匿名用户'
  };
  let doc = yield(new User(data)).save();
  return doc.toJSON();
}

/**
 * [get description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function* get(id) {
  let User = mongodb.model('User');
  let doc = yield User.findOne({
    id: id
  }).exec();
  if (doc) {
    doc = doc.toJSON();
  }
  return doc;
}

/**
 * [favor description]
 * @param  {[type]} id   [description]
 * @param  {[type]} book [description]
 * @return {[type]}      [description]
 */
function* favor(id, book) {
  // body...
}
