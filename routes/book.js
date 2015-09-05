'use strict';
module.exports = [{
  route: [
    '/1/books/list',
    '/1/books/list/category/:category',
    '/1/books/list/author/:author',
    '/1/books/list/name/:name',
    '/1/books/list/tag/:tag'
  ],
  handler: 'book.list'
}, {
  route: [
    '/1/books/count',
    '/1/books/count/category/:category',
    '/1/books/count/author/:author'
  ],
  handler: 'book.count'
}, {
  route: ['/1/books/add/:name', '/1/books/add/:name/:author'],
  handler: 'book.add'
}, {
  route: '/1/books/update/:id',
  middleware: 'common.no-query',
  handler: 'book.update'
}, {
  route: '/1/books/user/:type',
  method: 'post',
  handler: 'book.behaviour'
}, {
  route: '/1/books/:id',
  middleware: 'common.no-query',
  handler: 'book.get'
}];
