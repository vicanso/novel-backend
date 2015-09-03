'use strict';
module.exports = [{
  route: '/1/users/me',
  middleware: 'no-cache',
  handler: 'user.me'
}, {
  route: '/1/user/favor',
  method: 'post',
  handler: 'user.favor'
}, {
  route: '/1/user/favorites',
  handler: 'user.favorites'
}];
