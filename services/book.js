'use strict';
const mongodb = localRequire('helpers/mongodb');
const httpRequst = localRequire('helpers/http-request');
const chuangshi = localRequire('services/chuangshi');
const errors = localRequire('errors');
const _ = require('lodash');
exports.add = add;
exports.get = get;
exports.update = update;

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
  return yield new Book(data).save()
}

/**
 * [get description]
 * @param  {[type]} id     [description]
 * @param  {[type]} fields [description]
 * @return {[type]}        [description]
 */
function* get(id, fields) {
  let Book = mongodb.model('Book');
  fields = fields || '';
  return yield Book.findById(id, fields).exec();
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
