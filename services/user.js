'use strict';
const mongodb = localRequire('helpers/mongodb');
const uuid = require('node-uuid');
const errors = localRequire('errors');
const bookService = localRequire('services/book');

exports.create = create;
exports.get = get;
exports.favor = favor;
exports.favorites = favorites;

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
  let user = yield getUserById(id);
  return user.toJSON();
}

/**
 * [favor description]
 * @param  {[type]} id   [description]
 * @param  {[type]} bookId [description]
 * @return {[type]}      [description]
 */
function* favor(id, bookId) {
  let user = yield getUserById(id);
  user.favorites.addToSet(bookId);
  yield user.save();
  return user.toJSON();
}

/**
 * [favorites description]
 * @param  {[type]} id     [description]
 * @param  {[type]} fields [description]
 * @return {[type]}        [description]
 */
function* favorites(id, fields) {
  let user = yield getUserById(id);
  let myFavorites = user.toJSON().favorites;
  if (!myFavorites.length) {
    return;
  }
  return yield bookService.getBookByIds(myFavorites, fields);
}

/**
 * [getUserById description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function* getUserById(id) {
  let User = mongodb.model('User');
  let doc = yield User.findOne({
    id: id
  }).exec();
  if (!doc) {
    throw errors.get('user is not found');
  }
  return doc;
}
