var utils = require('../utils');

var iterateEachLine = function (bufferArray) {
  var inComment = false;

  for (var i = 0; i < bufferArray.length; i++) {
    console.log(bufferArray[i]);
    if (hasIf(bufferArray[i])) {

      var indexOfIf = hasIf(bufferArray[i]);

      var beforeIf = bufferArray[i].slice(0, indexOfIf);
      var afterIf = bufferArray[i].slice(indexOfIf + 2);
      var ifVariableName = getFirstVariableName(afterIf)[0];
      var afterIfVariableName = getFirstVariableName(afterIf)[1];

      // if (hasAnd(afterIfVariableName)) {
      //   var afterIf = hasIf(bufferArray[i]);
      //   var ifVariableName = getFirstVariableName(afterIf)[0];
      //   var afterIfVariableName = getFirstVariableName(afterIf)[1];

      // }

      var result = ['if (' + ifVariableName + ') {',
                    beforeIf,
                    '}'];

      console.log(result);
      bufferArray.splice(i,1);
      bufferArray = utils.concatArrayInsideArray(result, i, bufferArray);
      i += result.length;
    }
  }

  return bufferArray;
};

var hasIf = function (bufferLine) {
  var indexOfIf = bufferLine.indexOf('if ');
  return indexOfIf !== - 1 ? indexOfIf : false;
};

var hasAnd = function (bufferLine) {
  var indexOfAnd = bufferLine.indexOf(' and ');
  return indexOfIf !== - 1 ? bufferLine.slice(indexOfAnd) : false;
};

var getFirstVariableName = function (bufferLine) {
  console.log("THIS LINE HAS AN IF STATEMENT");
  console.log(bufferLine);
  bufferLine = bufferLine.trim();
  var variableName = "";
  for (var i = 0; i < bufferLine.length; i++) {
    if (bufferLine[i] === ' ') {
      bufferLine = bufferLine.slice(i);
      break;
    }
    variableName += bufferLine[i];
  }

  return [variableName, bufferLine];
};





module.exports = iterateEachLine;
