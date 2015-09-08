'use strict';
const mongodb = localRequire('helpers/mongodb');
const uuid = require('node-uuid');
const errors = localRequire('errors');
const bookService = localRequire('services/book');

exports.create = create;
exports.get = get;
exports.favor = favor;
exports.favorites = favorites;
exports.list = list;

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
  return yield bookService.getByIds(myFavorites, fields);
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


/**
 * [list description]
 * @param  {[type]} conditions [description]
 * @param  {[type]} options    [description]
 * @param  {[type]} fields     [description]
 * @return {[type]}            [description]
 */
function* list(conditions, options, fields) {
  debug('user query conditions:%j, options:%j, fields:%s', conditions,
    options,
    fields);
  let User = mongodb.model('User');
  let docs = yield User.find(conditions, fields).setOptions(options).exec();
  return _.map(docs, function(doc) {
    return doc.toJSON();
  });
}
