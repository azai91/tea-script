'use strict';

var utils = require('../utils');

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
      forLoop,
      isSliceable;

  for (var i = 0; i < bufferArray.length; i++) {

    //looks for double brackets
    if (findArrayRanges(bufferArray[i])) {
      rangeVariables = findArrayRanges(bufferArray[i]);
      variableName = getVariableName(bufferArray[i].slice(0, rangeVariables[2]));
      arrayInString = bufferArray[i].slice(rangeVariables[0], rangeVariables[1]);
      isSliceable = rangeVariables[3];

      console.log('variable name ', variableName);

      //looks for ellipses
      //hasEllipsis returns [leftBound, rightBound, isInclusive]
      if (hasEllipsis(arrayInString)) {
        if (!isSliceable) {
          var boundVariables = hasEllipsis(arrayInString);
          forLoop = convertEllipsisToForLoop(boundVariables[0], boundVariables[1], boundVariables[2], variableName);
          bufferArray.splice(i,1);
          bufferArray = utils.concatArrayInsideArray(forLoop, i, bufferArray);
        }
        if (isSliceable) {
          var boundVariables = hasEllipsis(arrayInString);

          //(leftBound, rightBound, isInclusive, beginning of bracket, end of bracket, bufferLine)
          bufferArray[i] = convertEllipsisToSlice(boundVariables[0], boundVariables[1], boundVariables[2], rangeVariables[0], rangeVariables[1], bufferArray[i]);
        }
      }

    }
  }

  return bufferArray;
};

/**
 * checks if line has array brackets
 * checks if letter or number preceedes bracket (slice)
 * TODO: need to check if array spans multiple lines
 *
 * @param  {String} buffer [start of first bracket, end of bracket, position of constant before = sign (used for finding variable name, is sliceable]

 * @return {[Mixed]}        [start of bracket, end of bracket, index of end of variable, isSliceable]
 */
var findArrayRanges = function (buffer) {
  var leftSquareBracket = 0,
      rightSquareBracket = 0,
      insideBracket = false,
      isSliceable = false,

      //these two variables will be used to get variables name
      recentVariableLetterPosition = 0,
      startPosition;

  for (var i = 0; i < buffer.length; i++) {
    if (buffer[i] === '[') {

      //looks for first bracket
      if (leftSquareBracket === 0 && buffer[i-1].match(/\w/g)) {
        isSliceable = true;
      }

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

      //checks to see if preceding letter is a letter or number
      if (isSliceable) {
        return [startPosition, i + 1, recentVariableLetterPosition + 1, true];
      }
      return [startPosition, i + 1, recentVariableLetterPosition + 1, false];
    }
  }

};

/**
 * verifies if array has ellipsis (...). returns false if ellipsis not found
 *
 * @param {String} bufferLine
 * @param {String} variableName - name of variable associcated with array
 * @return {[String] | boolean} [leftBound, rightBound, isInclusive]
 */
//needs refactor
var hasEllipsis = function(bufferLine, variableName) {
  var isInclusive = false,
      ellipsisIndex,
      leftBound,
      rightBound;

      //trim away brackets
      bufferLine = bufferLine.slice(1, bufferLine.length - 1);

      console.log('line %s', bufferLine);
  if (bufferLine.match(/\.\.\./g)) {
    ellipsisIndex = bufferLine.indexOf('...');
    console.log('exclusive');
    leftBound = Number(bufferLine.slice(0, ellipsisIndex));
    rightBound = Number(bufferLine.slice(ellipsisIndex + 3));
  } else if (bufferLine.match(/\.\./g)) {
    isInclusive = true;
    ellipsisIndex = bufferLine.indexOf('..');
    leftBound = Number(bufferLine.slice(0, ellipsisIndex));
    rightBound = Number(bufferLine.slice(ellipsisIndex + 2));
  } else {
    return false;
  }
  return [leftBound, rightBound, isInclusive];
};

var convertEllipsisToForLoop = function (leftBound, rightBound, isInclusive, variableName) {
  console.log('leftBound %d, rightBound %d', leftBound, rightBound);

  if (isInclusive) {
    if (leftBound < rightBound) {
      return ['for (var _i = ' + leftBound +' ; _i <= ' + rightBound + '; _i++) {',
              '  ' + variableName + '.push(_i);',
              '}'];
    }
    if (leftBound > rightBound) {
      return ['for (var _i = ' + leftBound +' ; _i >= ' + rightBound + '; _i--) {',
              '  ' + variableName + '.push(_i);',
              '}'];
    }
    if (leftBound === rightBound) {
      return [];
    }
  }

  if (leftBound < rightBound) {
    return ['for (var _i = ' + leftBound +' ; _i < ' + rightBound + '; _i++) {',
            '  ' + variableName + '.push(_i);',
            '}'];
  }
  if (leftBound > rightBound) {
    return ['for (var _i = ' + leftBound +' ; _i > ' + rightBound + '; _i--) {',
            '  ' + variableName + '.push(_i);',
            '}'];
  }
  if (leftBound === rightBound) {
    return [];
  }
};

/**
 * [convertEllipsisToSlice description]
 * @param  {[type]}  leftBound    [description]
 * @param  {[type]}  rightBound   [description]
 * @param  {Boolean} isInclusive  [description]
 * @param  {[type]}  variableName [description]
 * @return {[type]}               [description]
 */
var convertEllipsisToSlice = function (leftBound, rightBound, isInclusive, startBracket, endBracket, bufferLine) {
  console.log('leftBound %d, rightBound %d', leftBound, rightBound);


  if (isInclusive) {
    rightBound++;
  }

  return bufferLine.slice(0,startBracket) + '.slice(' + leftBound + ', ' + rightBound + ')' + bufferLine.slice(endBracket);
};

/**
 * gets variable name given variable name is at end of string (string = "var these")
 * @type {[type]}
 */
var getVariableName = function (pastString) {
  for (var i = pastString.length - 1; i >= 0; i--) {
    if (pastString[i] === ' ') {
      return pastString.slice(i + 1);
    }
  }

  return pastString;
};

module.exports = iterateThroughEachLine;

