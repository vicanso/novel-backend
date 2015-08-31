'use strict';
const book = localRequire('services/book');
const Joi = require('joi');
exports.add = add;
exports.get = get;
exports.update = update;

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

function* update() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.params.id;
  let result = yield book.update(id);
}
