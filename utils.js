'use strict';

var stringHandlers = {

  removeJSONQuotes: function(bufferString) {
    return bufferString.slice(1, bufferString.length - 1);
  },

  removePreviousLine: function (bufferString) {
    for (var i = bufferString.length - 1; i > 0; i--) {
      if (bufferString[i] === 'n' && bufferString[i-1] === '\\') {
        console.log(bufferString.slice(1, i));
        return bufferString.slice(1, i + 1);
      }
    }
  },

  addQuotes: function (bufferString) {
    return '"' + bufferString +'"';
  },

  /**
   * breaks JSON buffer strings into lines and puts each line into array
   * @return {[type]} [description]
   */
  breakIntoLines: function (bufferString) {
    console.log(bufferString);
    return bufferString.split('\\n');
  },

  /**
   * joins Array into single string
   * @param  {[type]} bufferArray [description]
   * @return {[type]}             [description]
   */
  compileBackIntoOutputString: function (bufferArray) {
    return bufferArray.join('\\n');
  }

};




module.exports = stringHandlers;