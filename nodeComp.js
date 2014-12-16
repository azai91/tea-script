var fs                = require('fs'),
    parseArrays       = require('./classes/Array'),
    utils             = require('./utils'),
    parseVariables    = require('./classes/Variables'),
    parseComments     = require('./classes/Comments');
    parseConditionals = require('./classes/Conditionals');

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
};

/**
 * runs parsing function for each class
 *
 * @param  {[String]} bufferArray
 * @return {[String]}
 */
var processDataString = function (bufferArray) {
  bufferArray = parseVariables(bufferArray);
  bufferArray = parseArrays(bufferArray);
  bufferArray = parseComments(bufferArray);
  bufferArray = parseConditionals(bufferArray);

  return bufferArray;
};

/**
 * write complete file to
 *
 * @param  {[type]} filePath - [description]
 * @param  {[type]} destPath - [description]
 * @return {[type]}          [description]
 */
var writeFile = function (filePath, destPath) {

  //read tea file
  var buffer = fs.readFileSync(filePath);
  buffer = buffer.toString();

  var bufferArray = preprocessInput(buffer);
  bufferArray = processDataString(bufferArray);

  buffer = postprocessInput(bufferArray);

  console.log(buffer);
  fs.writeFile(destPath, buffer, function(err) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = writeFile;