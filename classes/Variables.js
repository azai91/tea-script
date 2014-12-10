'use strict';

var variableHandler = {



};

//hoists non declared variables
var hoistVariables = function (bufferArray) {
    var previousScope = 0,
        undeclaredVariableList = [],
        previousVariable,
        variableName;

    for (var i = 0; i < bufferArray.length; i++) {
      if (hasVariableName(bufferArray[i])) {

        variableName = hasVariableName(bufferArray[i]);

        console.log(variableName);

        if (!isVariableDeclared(bufferArray[i], variableName)) {
          undeclaredVariableList.push('var ' + variableName + ';');
        }
      }
    }

    return undeclaredVariableList.concat(bufferArray);
}

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

var isVariableDeclared = function (bufferLine, variableName) {
  bufferLine = bufferLine.slice(0, bufferLine.indexOf(variableName));
  return bufferLine.match('var') ? true : false;
}

module.exports = hoistVariables;