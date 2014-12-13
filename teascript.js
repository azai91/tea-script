'use strict';

var writeFile = require('./nodeComp');

var path = {
  source: __dirname + '/sample.js',
  dest: __dirname +'/output.js'
};

var start = function (filePath, destPath) {
  writeFile(filePath, destPath);
};

start(path.source, path.dest);