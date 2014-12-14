'use strict';

var utils = require('../utils');

var variableHandler = {



};


/**
 * [hoistVariables description]
 * @param  {[type]} bufferArray [description]
 * @return {[type]}             [description]
 */
var hoistVariables = function (bufferArray) {
  var previousScope = 0,

      //contains elements with [line number, bracket count, array of variables]
      undeclaredVariableList = [],
      previousScopeLine = [],
      previousVariable,
      variableName;

  undeclaredVariableList.push([ 0, 0, [] ]);

  for (var i = 0; i < bufferArray.length; i++) {

    //checks if function is in line
    if (hasFunction(bufferArray[i])) {
      undeclaredVariableList.push([ i, 0, [] ]);
    }
    console.log(undeclaredVariableList);
    undeclaredVariableList[undeclaredVariableList.length - 1][1] += getCurlyBracketCount(bufferArray[i]);


    if (hasVariableName(bufferArray[i])) {
      variableName = hasVariableName(bufferArray[i]);

      console.log(variableName);

      if (!isVariableDeclared(bufferArray[i], variableName)) {
        var space = "";
        for (var scopeCounter = 0; scopeCounter < undeclaredVariableList.length - 1; scopeCounter++) {
          space += "  ";
        }
        undeclaredVariableList[undeclaredVariableList.length - 1][2].push(space + 'var ' + variableName + ';');
      }
    }
    //end of scope, not first line
    if (undeclaredVariableList[undeclaredVariableList.length - 1][1] === 0 && undeclaredVariableList.length !== 1) {
      var variables = undeclaredVariableList.pop();
      // console.log(variables);
      bufferArray = utils.concatArrayInsideArray(variables[2], variables[0] + 1, bufferArray);
      console.log(bufferArray);
      i += variables[2];
    }
  }

  return undeclaredVariableList[0][2].concat(bufferArray);
}

/**
 * checks to see line has variable by looking for single equal sign
 *
 * @param  {String}  bufferLine
 * @return {Boolean}
 */
var hasVariableName = function (bufferLine) {
  var equals = false,
      variableNameReversed = '',
      endOfVariable = false;

  // looks for single equals sign. If found then will extract variable name and check if prefaced with 'var'
  if (bufferLine.match(/[^=]\s?=\s[^=]/g)) {
    for (var i = bufferLine.length - 1; i >= 0; i--) {
      if (equals && bufferLine[i] !== ' ' && !endOfVariable) {
        variableNameReversed += bufferLine[i];
      }
      if (variableNameReversed && bufferLine[i] === ' ') {
        endOfVariable = true;
      }
      if (bufferLine[i] === '=') {
        equals = true;
      }
    }
  };

  return variableNameReversed.split('').reverse().join('');
}

/**
 * checks if the line has function in it
 *
 * @param  {String}  bufferLine
 * @return {Boolean}
 */
var hasFunction = function (bufferLine) {
  return bufferLine.match(/function/) ? true : false;
};

var getCurlyBracketCount = function (bufferLine) {
  var counter = 0;
  for (var i = 0; i < bufferLine.length; i++) {
    if (bufferLine[i] === '{') {
      counter++;
    }
    if (bufferLine[i] === '}') {
      counter--;
    }
  }
  return counter;
};

var isVariableDeclared = function (bufferLine, variableName) {
  bufferLine = bufferLine.slice(0, bufferLine.indexOf(variableName));
  return bufferLine.match('var') ? true : false;
}

module.exports = hoistVariables;