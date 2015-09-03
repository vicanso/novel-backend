'use strict';
const _ = require('lodash');
const userService = localRequire('services/user');
exports.me = me;
exports.favor = favor;

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
  // console.dir(result);
  //  || uuid.v4();
  // ctx.body = {
  //   name:
  // };
  // let ua = ctx.get('user-agent');
  // console.dir(ctx.get('jt-token'));
  // console.dir(ua);
}


/**
 * [favor description]
 * @return {[type]} [description]
 */
function* favor() {
  /*jshint validthis:true */
  let ctx = this;
  let id = ctx.get('jt-token');
}
