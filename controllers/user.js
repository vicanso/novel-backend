'use strict';
const _ = require('lodash');
const Joi = require('joi');
const userService = localRequire('services/user');
exports.me = me;
exports.favor = favor;
exports.favorites = favorites;

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


function* favorites() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
  let query = Joi.validateThrow(ctx.query, {
    fields: Joi.string().default('name author desc cover')
  });
  ctx.body = yield userService.favorites(id, query.fields);
}
