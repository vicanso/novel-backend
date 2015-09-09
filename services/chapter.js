'use strict';
const mongodb = localRequire('helpers/mongodb');

exports.add = add;

function* add(data) {
  let Chapter = mongodb.model('Chapter');
  let doc = yield(new Chapter(data)).save();
  console.dir(doc.toJSON());
  return doc.toJSON();
}
