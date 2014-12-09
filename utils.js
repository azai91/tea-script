'use strict';

var stringHandlers = {

  remvoeQuotes: function(bufferString) {
    return bufferString.slice(1, bufferString - 1);

  },

  removePreviousLine: function (bufferString) {
    for (var i = bufferString.length - 1; i > 0; i--) {
      if (bufferString[i] === 'n' && bufferString[i-1] === '\\') {
        console.log(bufferString.slice(1, i));
        return bufferString.slice(1, i + 1);
      }
    }
  },

  addQuotes: function(bufferString) {
    return '"' + bufferString +'"';
  }
};




module.exports = stringHandlers;