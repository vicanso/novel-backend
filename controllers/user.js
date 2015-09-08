'use strict';
const _ = require('lodash');
const Joi = require('joi');
const userService = localRequire('services/user');
const bookService = localRequire('services/book');
const commentService = localRequire('services/comment');
exports.me = me;
exports.favor = favor;
exports.favorites = favorites;
exports.behaviour = behaviour;
exports.comment = comment;

/**
 * [me description]
 * @return {[type]} [description]
 */
function* me() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
  let result;
  if (!id) {
    result = yield userService.create();
  } else {
    result = yield userService.get(id);
  }
  ctx.body = _.pick(result, ['name', 'id']);
}


/**
 * [favor description]
 * @return {[type]} [description]
 */
function* favor() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
  let data = Joi.validateThrow(ctx.request.body, {
    id: Joi.string()
  });
  let result = yield userService.favor(id, data.id);
  ctx.body = null;
}

/**
 * [favorites description]
 * @return {[type]} [description]
 */
function* favorites() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
  let query = Joi.validateThrow(ctx.query, {
    fields: Joi.string().default('name author desc cover')
  });
  ctx.body = yield userService.favorites(id, query.fields);
}


/**
 * [behaviour like view等操作]
 * @return {[type]} [description]
 */
function* behaviour() {
  /*jshint validthis:true */
  let ctx = this;
  let userId = ctx.get('jt-token');
  let data = Joi.validateThrow(ctx.request.body, {
    id: Joi.string()
  });
  let params = Joi.validateThrow(ctx.params, {
    type: Joi.string().valid(['like', 'favor', 'view'])
  });
  let bookId = data.id;
  let type = params.type;
  if (type === 'favor') {
    yield userService.favor(userId, bookId);
  }
  let result = yield bookService.behaviour(type, bookId);

  ctx.body = null;
}

/**
 * [comment description]
 * @return {[type]} [description]
 */
function* comment() {
  /*jshint validthis:true */
  let ctx = this;
  let paramsSchema = Joi.object().keys({
    target: Joi.string().length(24)
  }).rename('bookId', 'target');
  let params = Joi.validateThrow(ctx.params, paramsSchema);
  let data = Joi.validateThrow(ctx.request.body, {
    content: Joi.string().min(5).max(1000)
  });
  let user = ctx.jtUser;
  data = _.extend(data, params);
  data.name = user.name;
  data.avatar = user.id;
  let result = yield commentService.add(data);
  ctx.body = null;
}
