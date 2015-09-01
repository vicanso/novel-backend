'use strict';
const book = localRequire('services/book');
const Joi = require('joi');
exports.add = add;
exports.get = get;
exports.update = update;
exports.list = list;
exports.count = count;

/**
 * [add description]
 */
function* add() {
  /*jshint validthis:true */
  let ctx = this;
  let name = ctx.params.name;
  let author = ctx.params.author;
  let result = yield book.add(name, author);
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
  let result = yield book.get(id, query.fields);
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
  let result = yield book.update(id);
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

  let result = yield book.list(conditions, options, fields);
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

  let total = yield book.count(conditions);
  ctx.set('Cache-Control', 'public, max-age=300');
  ctx.body = {
    total: total
  };

}
