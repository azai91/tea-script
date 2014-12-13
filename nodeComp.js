'use strict';

var fs = require('fs'),
    findArrays = require('./classes/Array'),
    utils = require('./utils'),
    hoistVariables = require('./classes/Variables');

var teascript = require('./index');

var readFile = function (filePath, callback) {
  fs.readFile(filePath, function(err, buffer) {
    if (err) {
      console.log(err);
    }
    if (callback !== undefined) {
      callback(buffer.toString());
    }
  });
}

/**
 * write complete file to
 * @param  {[type]} filePath [description]
 * @param  {[type]} destPath [description]
 * @return {[type]}          [description]
 */
var writeFile = function (filePath, destPath) {
  readFile(filePath, function (buffer) {
    buffer = utils.removeJSONQuotes(JSON.stringify(buffer));
    var bufferArray = utils.breakIntoLines(buffer);
    bufferArray = findArrays(bufferArray);
    bufferArray = hoistVariables(bufferArray);
    console.log('bufferArray');
    console.log(bufferArray);

    buffer = utils.compileBackIntoOutputString(bufferArray);

    buffer = utils.addQuotes(buffer);
    console.log('buffer');
    console.log(buffer);
    fs.writeFile(destPath, JSON.parse(buffer), function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
};

module.exports = writeFile;