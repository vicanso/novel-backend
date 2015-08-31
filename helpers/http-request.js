'use strict';
const request = require('superagent');
const _ = require('lodash');
const util = require('util');
const sdc = localRequire('helpers/sdc');

exports.get = get;
exports.timeout = 10 * 1000;
var processing = 0;
var processedTotal = 0;
/**
 * [get 请求数据]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function* get(url, headers) {
  let req = request.get(url);
  _.forEach(headers, function(v, k) {
    req.set(k, v);
  });
  return yield handle(req);
}


/**
 * [handle description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function* handle(req) {
  let res = {};
  let start = Date.now();
  processing++;
  processedTotal++;
  sdc.increment('request.processing');

  let fs = require('fs');
  let path = require('path');
  let file = path.join(__dirname, '../search.txt');
  if (req.url ===
    'http://chuangshi.qq.com/search/searchindex?type=all&wd=%E4%B8%83%E7%95%8C%E6%AD%A6%E7%A5%9E'
  ) {
    file = path.join(__dirname, '../search.txt');
  } else if (req.url === 'http://chuangshi.qq.com/bk/xh/243446-l.html') {
    file = path.join(__dirname, '../list.txt');
  } else if (req.url === 'http://chuangshi.qq.com/bk/xh/243446-r-1.html') {
    file = path.join(__dirname, '../content.txt');
  }
  let str = yield new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, str) {
      resolve(str);
    });
  });
  return {
    text: str
  };

  try {
    res = yield new Promise(function(resolve, reject) {
      req.timeout(exports.timeout).end(function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  } catch (err) {
    throw err;
  } finally {
    processing--;
    let statusCode = res.statusCode || 0;
    let length = _.get(res, 'headers.content-length') || _.get(res,
      'text.length') || 0;
    let use = Date.now() - start;
    let str = util.format('request "%s %s" %d %d %dms %d-%d', req.method, req
      .url, statusCode, length, use, processing, processedTotal);

    sdc.decrement('request.processing');
    sdc.increment('request.status.' + statusCode);
    sdc.timing('request.use', use);
    console.info(str);
  }

  return res;
}
