// 创世中文网
'use strict';
const httpRequst = localRequire('helpers/http-request');
const util = require('util');
const cheerio = require('cheerio');
const _ = require('lodash');

exports.search = search;
exports.chapters = chapters;
exports.chapterContent = chapterContent;

/**
 * [search description]
 * @param  {[type]} name   [description]
 * @param  {[type]} author [description]
 * @return {[type]}        [description]
 */
function* search(name, author) {
  let encodeName = encodeURI(name);
  let url = util.format(
    'http://chuangshi.qq.com/search/searchindex?type=all&wd=%s', encodeName
  );
  let res = yield httpRequst.get(url);
  let $ = cheerio.load(res.text);
  let getId = function(url) {
    let reg = /(\d+).html/;
    let result = reg.exec(url);
    if (!result) {
      return;
    }
    return parseInt(result[1]);
  };
  let books = _.map($('#searchResultList li'), function(item) {
    item = $(item);
    let reg =
      /([\S\s]+)作者：([\S\s]+)分类：([\S\s]+)标签：([\S\s]+)简介：([\S\s]+)最新章节：/gmi;
    let regResult = reg.exec(item.find('.search_r_info').text());
    if (!regResult || regResult.length < 5) {
      return;
    }
    let name = regResult[1].trim();
    let author = regResult[2].trim();
    let category = regResult[3].trim().replace(/[\[\]]/g, '');
    let tags = regResult[4].trim().split(/\s/);
    let desc = regResult[5].trim();
    let id = getId(item.find('.search_r_img a').attr('href'));
    if (!id) {
      return;
    }
    let src = {
      type: 'chuangshi',
      id: id
    };
    return {
      name: name,
      author: author,
      category: category,
      tags: tags,
      desc: desc,
      cover: item.find('.search_r_img img').attr('src'),
      src: src
    };
  });
  let result = _.find(_.compact(books), function(item) {
    return item.name === name && (!author || item.author === author);
  });
  if (!result) {
    return result;
  }
  result.chapters = yield chapters(result.src.id);
  return result;
}

/**
 * [chapters description]
 * @param  {[type]} id [description]
 * @return {[type]}      [description]
 */
function* chapters(id) {
  let url = util.format('http://chuangshi.qq.com/bk/xh/%d-l.html', id);
  let res = yield httpRequst.get(url);
  let $ = cheerio.load(res.text);
  let chaptersList = [];
  _.forEach($('.indexbox .list a'), function(item) {
    item = $(item);
    let reg = /字数：(\d+)[\s\S]*更新时间：([\s\S]+)/;
    let result = reg.exec(item.attr('title'));
    if (result) {
      let count = parseInt(result[1]);
      let updatedAt = result[2];
      if (count > 1000) {
        chaptersList.push({
          title: item.find('.title').text().trim().split(' ')[1],
          realCount: count,
          href: item.attr('href'),
          updatedAt: updatedAt
        });
      }
    }
  });
  return chaptersList;
}

/**
 * [chapterContent description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function* chapterContent(url) {
  let res = yield httpRequst.get(url);
  console.dir(res.text);
}
