'use strict';

var stringHandlers = require('../utils');

var arrayHandler = function() {

};

//finds
var findArraysRanges = function (buffer) {
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
      console.log(leftSquareBracket);
      console.log(rightSquareBracket);
      insideBracket = false;
      variableName = getVariableName(buffer.slice(0, recentVariableLetterPosition + 1));

      console.log(variableName);
      //array from buffer
      var array = buffer.slice(startPosition, i + 1);

      if (convertRangesToLoop(array, variableName)) {

        console.log('buffer');
        console.log(buffer.slice(0, i));
        buffer = stringHandlers.removePreviousLine(buffer.slice(0, i));
        buffer +=  convertRangesToLoop(array, variableName);
      }
    }
  }

  return buffer;
};

/**
 * verifies if array has ellipsis.
 * @type {[type]}
 */
var convertRangesToLoop = function(arrayString, variableName) {
  var compiledString = "";
  if (arrayString.match('...')) {

    //trim away brackets
    arrayString = arrayString.slice(1, arrayString.length - 1);

    var ellipsisIndex = arrayString.indexOf('...');
    var leftBound = Number(arrayString.slice(0, ellipsisIndex));
    var rightBound = Number(arrayString.slice(ellipsisIndex + 3));
  }
  if (leftBound < rightBound) {
    compiledString = 'for (var _i = ' + leftBound +' ; _i < ' + rightBound + '; _i++) {\\n' +
              '\\t' + variableName + '.push(_i);\\n' +
              '}\\n';
  } else if (leftBound > rightBound) {
    compiledString = 'for (var _i = ' + rightBound +' ; _i >= ' + leftBound + '; _i--) {\\n' +
              '\\t' + variableName + '.push(_i);\\n' +
              '}\\n';
  } else {
    compiledString = '[]'
  }

  return compiledString || false;
};

var getVariableName = function(pastString) {
  console.log(pastString);
  for (var i = pastString.length - 1; i >= 0; i--) {
    if ((pastString[i] === ' ')||(pastString[i] === 'n' && pastString[i - 1] === "\\")) {
      return pastString.slice(i + 1);
    }
  }

  return '';
};

module.exports = findArraysRanges;

