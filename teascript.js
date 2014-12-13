'use strict';

var compile = require('./nodeComp');

var path = {
  source: __dirname + '/sample.tea',
  dest: __dirname +'/output.js'
};

/**
 * compiles tea file to js file
 *
 * @param  {String} filePath - location of tea file
 * @param  {String} destPath - location of destination
 */
var start = function (filePath, destPath) {
  compile(filePath, destPath);
};

start(path.source, path.dest);