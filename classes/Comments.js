var iterateEachLine = function (bufferArray) {
  var inComment = false;

  for (var i = 0; i < bufferArray.length; i++) {

    //if finds ###
    if (hasBlockComments(bufferArray[i])) {

      //then replace with /* or */ depending if blocking is for starting comment or ending comment
      if (inComment) {
        bufferArray[i] = convertEndBlockComments(bufferArray[i]);
        inComment = false;
      } else {
        bufferArray[i] = convertFrontBlockComments(bufferArray[i]);
        inComment = true;
      }
    } else if (hasLineComments(bufferArray[i])) {
      bufferArray[i] = convertLineComments(bufferArray[i]);
    }


  }

  return bufferArray;
};

/**
 * returns true if line contains block comment (###)
 *
 * @param  {String} bufferLine
 * @return {Boolean}
 */
var hasBlockComments = function (bufferLine) {
  return bufferLine.match("###") !== null ? true : false;
};

/**
 * return true if line contains line comment (#)
 *
 * @param  {String}  bufferLine
 * @return {Boolean}
 */
var hasLineComments = function (bufferLine) {
  return bufferLine.match(/#/) ? true : false;
};

var convertFrontBlockComments = function (bufferLine) {
  return bufferLine.replace(/###/, '/*');
};

var convertEndBlockComments = function (bufferLine) {
  return bufferLine.replace(/###/, '*/');
};

var convertLineComments = function (bufferLine) {
  var indexOfComment = bufferLine.indexOf('#');
  return bufferLine.slice(0, indexOfComment);
};

module.exports = iterateEachLine;
