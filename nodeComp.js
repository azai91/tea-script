'use strict';

var fs = require('fs'),
    findArrays = require('./classes/Array'),
    utils = require('./utils'),
    hoistVariables = require('./classes/Variables'),
    parseComments = require('./classes/Comments');


/**
 * reads tea file and passes content of file to callback
 *
 * @param  {String}   filePath location of tea file
 * @param  {Function} callback
 */
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
 * converts input to JSON, removes outermost quotes, and places each line into an index of an array
 *
 * @param {String} bufferString input from file
 * @return {[String]} stringified version of each line
 */
var preprocessInput = function (bufferString) {
  bufferString = utils.removeJSONQuotes(JSON.stringify(bufferString));
  return utils.breakIntoLines(bufferString);
};

/**
 * converts processed array back into single string ready to be written to output file
 *
 * @param  {[String]} bufferArray
 * @return {String}
 */
var postprocessInput = function (bufferArray) {
  var buffer = utils.compileArrayBackIntoString(bufferArray);
  return JSON.parse(utils.addQuotes(buffer));
}


/**
 * moves undeclared variables to top of scope
 *
 * @param  {[String]} bufferArray
 * @return {[String]} processed array
 */
var processForVariables = function (bufferArray) {
 return hoistVariables(bufferArray);
};

/**
 * converts CS array styles into JS
 *
 * @param {[String]} bufferArray - array containing each line of input string
 * @return {[String]} processed array
 */
var processForArrays = function (bufferArray) {
  return findArrays(bufferArray);
};

var processForComments = function (bufferArray) {
  return parseComments(bufferArray);
};

/**
 * write complete file to
 *
 * @param  {[type]} filePath - [description]
 * @param  {[type]} destPath - [description]
 * @return {[type]}          [description]
 */
var writeFile = function (filePath, destPath) {
  readFile(filePath, function (buffer) {
    var bufferArray = preprocessInput(buffer);
    bufferArray = processForVariables(bufferArray);
    bufferArray = processForArrays(bufferArray);
    bufferArray = processForComments(bufferArray);

    buffer = postprocessInput(bufferArray);
    console.log('buffer');
    console.log(buffer);
    fs.writeFile(destPath, buffer, function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
};

module.exports = writeFile;