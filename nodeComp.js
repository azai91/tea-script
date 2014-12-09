'use strict';

var fs = require('fs');

var teascript = require('./index');

teascript.loadFile = function (filePath, callback) {
  fs.readFile(fileName, function (err, buffer) {
    if (err) {
      console.log(err);
    }
    if (callback !== undefined) {
      callback(buffer.toString());
    }
  });
};

module.exports = teascript;