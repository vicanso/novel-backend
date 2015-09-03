FROM vicanso/iojs

MAINTAINER "vicansocanbico@gmail.com"

ADD ./ /novel-backend

RUN cd /novel-backend \
  && npm install --production  --registry=https://registry.npm.taobao.org

CMD cd /novel-backend && NODE_ENV=production node app
