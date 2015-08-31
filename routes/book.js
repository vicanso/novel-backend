'use strict';
module.exports = [{
  route: ['/1/books/add/:name', '/1/books/add/:name/:author'],
  handler: 'book.add'
}, {
  route: '/1/books/update/:id',
  middleware: ['common.no-query'],
  handler: 'book.update'
}, {
  route: '/1/books/:id',
  middleware: ['common.no-query'],
  handler: 'book.get'
}];
