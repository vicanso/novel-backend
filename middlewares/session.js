'use strict';
const debug = localRequire('helpers/debug');
const _ = require('lodash');
const zipkin = localRequire('helpers/zipkin');
const userService = localRequire('services/user');
const errors = localRequire('errors');
let sessionParser = null;
exports.init = init;
exports.get = get;


/**
 * [init 初始化session redis client]
 * @param  {Boolean} redisConfig   [description]
 * @param  {[type]}  sessionConfig [description]
 * @return {[type]}                [description]
 */
function init(redisConfig, sessionConfig) {
  debug('session redisConfig:%j, sessionConfig:%j', redisConfig, sessionConfig);
  const session = require('koa-generic-session');
  const redisStore = require('koa-redis');
  let store = redisStore(redisConfig);
  let options = _.clone(sessionConfig);
  options.store = store;
  options.errorHandler = function errorHandler(err, type) {
    console.error('session error:%s, type:%s', err.message, type);
  };
  sessionParser = session(options);
}


/**
 * [get 获取session]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function* get(next) {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
  if (!id) {
    throw errors.get('user is not login', 403);
  }
  let data = yield userService.get(id);
  ctx.jtUser = data;
  yield * next;
}
