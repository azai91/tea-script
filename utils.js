'use strict';

var utils = {

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
   *
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
  compileArrayBackIntoString: function (bufferArray) {
    return bufferArray.join('\\n');
  },

  /**
   * concats array into the middle of another array
   *
   * @param {Array} smallArray - array to be inserted into larger array
   * @param {Integer} index - index where smallArray will insert into
   * @param {Array} largeArray - array that will have elements inserted into it
   * @return {Array} complete array
   */
  concatArrayInsideArray: function (smallArray, index, largeArray) {
    var cloneLargeArray = largeArray.slice(0);

    for (var i = smallArray.length - 1; i >= 0; i--) {
      cloneLargeArray.splice(index,0,smallArray[i]);
    }

    return cloneLargeArray;
  }

};


module.exports = utils;