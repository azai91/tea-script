'use strict';

var stringHandlers = require('../utils');

var arrayHandler = function() {

};

var iterateThroughEachLine = function (bufferArray) {
  var variableName;

  for (var i = 0; i < bufferArray.length; i++) {
    if (findArrayRanges(bufferArray[i])) {
      console.log('once');
      var rangeVariables = findArrayRanges(bufferArray[i]);
      console.log(getVariableName(bufferArray[i].slice(0, rangeVariables[2])));
      variableName = getVariableName(bufferArray[i].slice(0, rangeVariables[2]));
      var array = bufferArray[i].slice(rangeVariables[0], rangeVariables[1]);

      if (convertRangesToLoop(array, variableName)) {

        console.log('variableName %d', variableName);
        var forLoop = convertRangesToLoop(array, variableName);

        bufferArray.splice(i,1, forLoop[0], forLoop[1], forLoop[2]);
      }
    }
  }
  console.log(bufferArray);
  return bufferArray;
}

/**
 * checks if line has full array
 * @param  {[String]} [start of first bracket, end of bracket, position of constant before = sign (used for finding variable name)]
 * @return {[type]}        [description]
 */
var findArrayRanges = function (buffer) {
  var leftSquareBracket = 0,
      rightSquareBracket = 0,
      insideBracket = false,

      //these two variables will be used to get variables name
      recentVariableLetterPosition = 0,
      // recentWhiteSpacePosition = 0,

      variableName,
      startPosition,
      equalsPosition;

  for (var i = 0; i < buffer.length; i++) {
    if (buffer[i] === '[') {

      leftSquareBracket++;
      insideBracket = true;
      startPosition = i;
      //gets potential variable name
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
 * verifies if array has ellipsis.
 * @type {[type]}
 */
var convertRangesToLoop = function(arrayString, variableName) {
  var compiledStringArray;
  if (arrayString.match('...')) {

    //trim away brackets
    arrayString = arrayString.slice(1, arrayString.length - 1);

    var ellipsisIndex = arrayString.indexOf('...');
    var leftBound = Number(arrayString.slice(0, ellipsisIndex));
    var rightBound = Number(arrayString.slice(ellipsisIndex + 3));
  }
  if (leftBound < rightBound) {
    compiledStringArray = ['for (var _i = ' + leftBound +' ; _i < ' + rightBound + '; _i++) {',
                      '  ' + variableName + '.push(_i);',
                      '}'];
  } else if (leftBound > rightBound) {
    compiledStringArray = ['for (var _i = ' + rightBound +' ; _i > ' + leftBound + '; _i--) {',
                      '  ' + variableName + '.push(_i);',
                      '}'];
  } else if (leftBound === rightBound) {
    compiledStringArray = [];
  }

  return compiledStringArray || false;
};

/**
 * gets variable name given variable name is at end of string (string = "var these")
 * @type {[type]}
 */
var getVariableName = function(pastString) {
  console.log(pastString);
  for (var i = pastString.length - 1; i >= 0; i--) {
    if (pastString[i] === ' ') {
      return pastString.slice(i + 1);
    }
  }

  return pastString;
};

module.exports = iterateThroughEachLine;

