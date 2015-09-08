'use strict';
const mongodb = localRequire('helpers/mongodb');
const errors = localRequire('errors');
const _ = require('lodash');

exports.add = add;
exports.get = get;

/**
 * [add description]
 * @param {[type]} data [description]
 */
function* add(data) {
  let Comment = mongodb.model('Comment');
  let doc = yield(new Comment(data)).save();
  return doc.toJSON();
}

/**
 * [get description]
 * @param  {[type]} conditions [description]
 * @param  {[type]} options    [description]
 * @return {[type]}            [description]
 */
function* get(conditions, options) {
  let Comment = mongodb.model('Comment');
  let docs = yield Comment.find(conditions).setOptions(options).exec();
  return _.map(docs, function(doc) {
    return doc.toJSON();
  });
}
