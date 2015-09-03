'use strict';

module.exports = {
  schema: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    favorites: []
  }
};
