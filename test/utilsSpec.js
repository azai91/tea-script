var expect = require('chai').expect,
    utils = require('../utils');

describe('Utils', function () {
  describe('concatArrayInsideArray', function () {
    it('should insert array into another array', function () {
      var array = [0,1,2];
      expect(utils.concatArrayInsideArray([9], 1, array)).to.eql([0,9,1,2]);
    });
  });

});