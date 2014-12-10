var fs = require('fs'),
    findArrays = require('./classes/Array'),
    utils = require('./utils');
    // teascript = require('./nodeComp');

var path = {
  source: __dirname + '/sample.js',
  dest: __dirname +'/output.js'
};

var readFile = function (filePath, callback) {
  fs.readFile(filePath, function(err, buffer) {
    if (err) {
      console.log(err);
    }
    if (callback !== undefined) {
      callback(buffer.toString());
    }
  });
}

var writeFile = function (filePath, destPath) {
  readFile(filePath, function (buffer) {
    buffer = utils.removeJSONQuotes(JSON.stringify(buffer));
    var bufferArray = utils.breakIntoLines(buffer);
    bufferArray = findArrays(bufferArray);
    console.log('bufferArray');
    console.log(bufferArray);

    buffer = utils.compileBackIntoOutputString(bufferArray);

    buffer = utils.addQuotes(buffer);
    console.log('buffer');
    console.log(buffer);
    fs.writeFile(destPath, JSON.parse(buffer), function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
};

writeFile(path.source, path.dest);