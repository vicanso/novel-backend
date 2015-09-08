'use strict';
const bookService = localRequire('services/book');
const commentService = localRequire('services/comment');
const Joi = require('joi');
const _ = require('lodash');
exports.add = add;
exports.get = get;
exports.update = update;
exports.list = list;
exports.count = count;
exports.behaviour = behaviour;
exports.comments = comments;
exports.search = search;


/**
 * [add description]
 */
function* add() {
  /*jshint validthis:true */
  let ctx = this;
  let name = ctx.params.name;
  let author = ctx.params.author;
  let result = yield bookService.add(name, author);
  let doc = result.toJSON();
  ctx.body = {
    id: doc._id
  };
}

/**
 * [get description]
 * @return {[type]} [description]
 */
function* get() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.params.id;
  let query = Joi.validateThrow(ctx.query, {
    fields: Joi.string().optional()
  });
  let result = yield bookService.getById(id, query.fields);
  ctx.set('Cache-Control', 'public, max-age=300');
  ctx.body = result.toJSON();
}

/**
 * [update description]
 * @return {[type]} [description]
 */
function* update() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.params.id;
  let result = yield bookService.update(id);
}

/**
 * [list description]
 * @return {[type]} [description]
 */
function* list() {
  /*jshint validthis:true */
  let ctx = this;
  let schema = Joi.object({
    skip: Joi.number().min(0).default(0),
    limit: Joi.number().default(10),
    sort: Joi.string().default('-latestUpdatedAt'),
    fields: Joi.string().default('-chapters')
  }).rename('start', 'skip');
  let options = Joi.validateThrow(ctx.query, schema);
  let fields = options.fields;
  delete options.fields;

  let conditionsSchema = Joi.object({
    category: Joi.string().optional(),
    author: Joi.string().optional(),
    name: Joi.string().optional(),
    tag: Joi.string().optional()
  });
  let conditions = Joi.validateThrow(ctx.params, conditionsSchema);

  let result = yield bookService.list(conditions, options, fields);
  ctx.set('Cache-Control', 'public, max-age=300');
  ctx.body = result;
}

/**
 * [count description]
 * @return {[type]} [description]
 */
function* count() {
  /*jshint validthis:true */
  let ctx = this;

  let conditionsSchema = Joi.object({
    category: Joi.string().optional(),
    author: Joi.string().optional()
  });
  let conditions = Joi.validateThrow(ctx.params, conditionsSchema);

  let total = yield bookService.count(conditions);
  ctx.set('Cache-Control', 'public, max-age=300');
  ctx.body = {
    total: total
  };
}

/**
 * [behaviour description]
 * @return {[type]} [description]
 */
function* behaviour() {
  /*jshint validthis:true */
  let ctx = this;
  let params = Joi.validateThrow(ctx.params, {
    type: Joi.string().valid(['like', 'view'])
  });
  let data = Joi.validateThrow(ctx.request.body, {
    id: Joi.string()
  });
  let result = yield bookService.behaviour(params.type, data.id);
  ctx.body = null;
}


/**
 * [comments description]
 * @return {[type]} [description]
 */
function* comments() {
  /*jshint validthis:true */
  let ctx = this;
  let bookId = ctx.params.id;
  let conditions = {
    target: bookId
  };
  let options = Joi.validateThrow(ctx.query, {
    skip: Joi.number().default(0),
    limit: Joi.number().default(10),
    sort: Joi.string().default('-createdAt')
  });
  let result = yield commentService.get(conditions, options);
  result = _.map(result, function(item) {
    return _.pick(item, 'createdAt content target name avatar'.split(' '));
  });
  ctx.set('Cache-Control', 'public, max-age=300');
  ctx.body = result;
}


/**
 * [search description]
 * @return {[type]} [description]
 */
function* search() {
  /*jshint validthis:true */
  let ctx = this;
  let query = Joi.validateThrow(ctx.query, {
    skip: Joi.number().default(0),
    limit: Joi.number().default(6),
    sort: Joi.string().default('-latestUpdatedAt'),
    fields: Joi.string().default('-chapters')
  });
  let keys = 'skip limit sort'.split(' ');
  let fields = query.fields;
  delete query.fields;
  let options = _.pick(query, keys);
  let conditions = _.omit(query, keys);
  let result = yield bookService.get(conditions, options, fields);
  ctx.set('Cache-Control', 'public, max-age=60');
  ctx.body = result;
}
