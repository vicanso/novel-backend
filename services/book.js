'use strict';
const mongodb = localRequire('helpers/mongodb');
const httpRequst = localRequire('helpers/http-request');
const chuangshi = localRequire('services/chuangshi');
const errors = localRequire('errors');
const debug = localRequire('helpers/debug');
const _ = require('lodash');
exports.add = add;
exports.getById = getById;
exports.update = update;
exports.list = list;
exports.count = count;
exports.getByIds = getByIds;
exports.behaviour = behaviour;
exports.get = get;

/**
 * [add description]
 * @param {[type]} name   [description]
 * @param {[type]} author [description]
 */
function* add(name, author) {
  let srcList = [];

  let data = yield chuangshi.search(name, author);
  if (!data) {
    throw errors.get('获取不到该小说相关信息');
  }
  srcList.push(data.src);
  // 删除来源信息
  delete data.src;
  _.forEach(data.chapters, function(chapter) {
    delete chapter.href;
  });
  let Book = mongodb.model('Book');
  let query = {
    name: name
  };
  if (author) {
    query.author = author;
  }
  let book = yield Book.findOne(query).exec();
  if (book) {
    throw errors.get('已添加该小说');
  }
  data.sources = srcList;
  return yield new Book(data).save();
}

/**
 * [getById description]
 * @param  {[type]} id     [description]
 * @param  {[type]} fields [description]
 * @return {[type]}        [description]
 */
function* getById(id, fields) {
  let Book = mongodb.model('Book');
  fields = fields || '';
  return yield Book.findById(id, fields).exec();
}


/**
 * [get description]
 * @param  {[type]} conditions [description]
 * @param  {[type]} options    [description]
 * @param  {[type]} fields     [description]
 * @return {[type]}            [description]
 */
function* get(conditions, options, fields) {
  let Book = mongodb.model('Book');
  let docs = yield Book.find(conditions, fields).setOptions(options).exec();
  return _.map(docs, function(doc) {
    return doc.toJSON();
  });
}

/**
 * [update description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function* update(id) {
  let url = 'http://chuangshi.qq.com/bk/xh/243446-r-1.html';
  yield chuangshi.chapterContent(url);

  // let Book = mongodb.model('Book');
  // let doc = yield Book.findById(id).exec();
  // doc = doc.toJSON();
  //
  // let getId = function(type) {
  //   let result = _.find(doc.sources, function(item) {
  //     return item.type === type;
  //   });
  //   return _.get(result, 'id');
  // }
  // let chuangshiId = getId('chuangshi');
  // if (chuangshiId) {
  //   let chapters = yield chuangshi.chapters(chuangshiId);
  //   console.dir(chapters[0]);
  // }
}

/**
 * [list description]
 * @param  {[type]} conditions [description]
 * @param  {[type]} options [description]
 * @param  {[type]} fields [description]
 * @return {[type]}        [description]
 */
function* list(conditions, options, fields) {
  debug('book query conditions:%j, options:%j, fields:%s', conditions,
    options,
    fields);
  let Book = mongodb.model('Book');
  let docs = yield Book.find(conditions, fields).setOptions(options).exec();
  return _.map(docs, function(doc) {
    return doc.toJSON();
  });
}

/**
 * [count description]
 * @param  {[type]} conditions [description]
 * @return {[type]}            [description]
 */
function* count(conditions) {
  debug('book count conditions:%j', conditions);
  let Book = mongodb.model('Book');
  return yield Book.count(conditions).exec();
}

/**
 * [getByIds description]
 * @param  {[type]} ids    [description]
 * @param  {[type]} fields [description]
 * @return {[type]}        [description]
 */
function* getByIds(ids, fields) {
  let Book = mongodb.model('Book');
  let docs = yield Book.find({
    _id: {
      '$in': ids
    }
  }, fields).exec();
  return _.map(docs, function(item) {
    return item.toJSON();
  });
}

/**
 * [behaviour description]
 * @param  {[type]} type [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
function* behaviour(type, id) {
  let Book = mongodb.model('Book');
  let update = {};
  update[type + '.total'] = 1;
  update[type + '.today'] = 1;
  let doc = yield Book.findByIdAndUpdate(id, {
    '$inc': update
  }).exec();
  return doc.toJSON();
}
