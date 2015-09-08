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
}, {
  route: '/1/user/behaviour/:type',
  method: 'post',
  handler: 'user.behaviour'
}, {
  route: '/1/user/comment/:bookId',
  method: 'post',
  middleware: 'session.get',
  handler: 'user.comment'
}];
