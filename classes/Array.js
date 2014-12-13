'use strict';

var stringHandlers = require('../utils');

var arrayHandler = function() {

};


/**
 * checks each line of code and searches for arrayRanges [1..10].
 *
 * @param  {[String]} bufferArray Array of each line of script
 * @return {[String]} Array of each line of script after accounting for array changes
 */
var iterateThroughEachLine = function (bufferArray) {
  var variableName,
      rangeVariables,
      arrayInString,
      forLoop;

  for (var i = 0; i < bufferArray.length; i++) {
    if (findArrayRanges(bufferArray[i])) {
      rangeVariables = findArrayRanges(bufferArray[i]);
      variableName = getVariableName(bufferArray[i].slice(0, rangeVariables[2]));
      arrayInString = bufferArray[i].slice(rangeVariables[0], rangeVariables[1]);

      if (convertRangesToLoop(arrayInString, variableName)) {

        forLoop = convertRangesToLoop(arrayInString, variableName);

        bufferArray.splice(i,1, forLoop[0], forLoop[1], forLoop[2]);
      }
    }
  }

  return bufferArray;
};

/**
 * checks if line has array brackets
 * TODO: need to check if array spans multiple lines
 *
 * @param  {String} buffer [start of first bracket, end of bracket, position of constant before = sign (used for finding variable name)]

 * @return {[type]}        [description]
 */
var findArrayRanges = function (buffer) {
  var leftSquareBracket = 0,
      rightSquareBracket = 0,
      insideBracket = false,

      //these two variables will be used to get variables name
      recentVariableLetterPosition = 0,
      startPosition;

  for (var i = 0; i < buffer.length; i++) {
    if (buffer[i] === '[') {
      leftSquareBracket++;
      insideBracket = true;
      startPosition = i;
    }
    if (buffer[i] === ']') {
      rightSquareBracket++;
    }
    if (!insideBracket) {
      if (buffer[i] !== ' ' && buffer[i] !== '=') {
        recentVariableLetterPosition = i;
      }
    }

    if (leftSquareBracket === rightSquareBracket && insideBracket) {
      return [startPosition, i + 1, recentVariableLetterPosition + 1];
    }
  }

  return false;
};

/**
 * verifies if array has ellipsis (...). returns false if ellipsis not found
 *
 * @param {String} bufferLine
 * @param {String} variableName name of variable associcated with array
 * @return {[String] | boolean} array containing each line of for loop.
 */
var convertRangesToLoop = function(bufferLine, variableName) {
  var ellipsisIndex,
      leftBound,
      rightBound;

  if (bufferLine.match('...')) {

    //trim away brackets
    bufferLine = bufferLine.slice(1, bufferLine.length - 1);
    ellipsisIndex = bufferLine.indexOf('...');
    leftBound = Number(bufferLine.slice(0, ellipsisIndex));
    rightBound = Number(bufferLine.slice(ellipsisIndex + 3));
  } else if (bufferLine.match('..')) {



  }
  console.log('leftBound %d, rightBound %d', leftBound, rightBound);

  if (leftBound < rightBound) {
    return ['for (var _i = ' + leftBound +' ; _i < ' + rightBound + '; _i++) {',
                      '  ' + variableName + '.push(_i);',
                      '}'];
  }
  if (leftBound > rightBound) {
    return ['for (var _i = ' + rightBound +' ; _i > ' + leftBound + '; _i--) {',
                      '  ' + variableName + '.push(_i);',
                      '}'];
  }
  if (leftBound === rightBound) {
    return [];
  }

  return false;
};

/**
 * gets variable name given variable name is at end of string (string = "var these")
 * @type {[type]}
 */
var getVariableName = function(pastString) {
  for (var i = pastString.length - 1; i >= 0; i--) {
    if (pastString[i] === ' ') {
      return pastString.slice(i + 1);
    }
  }

  return pastString;
};

module.exports = iterateThroughEachLine;

