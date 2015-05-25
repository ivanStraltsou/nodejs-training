var zlib = require('zlib');
var fs = require('fs');
var q = require('q');
var stream = require('stream');

var EXT = '.zip';

module.exports.zip = function(filename, data) {
  var gzip = zlib.createGzip();
  var input = new stream.Readable();
  var out = fs.createWriteStream(filename + EXT);
  var deferred = q.defer();

  input._read = function noop() {};
  input.push(data);
  input.push(null);

  input.pipe(gzip).pipe(out);

  input
    .on('end', function(err, data) {
      deferred.resolve(data);
    })
    .on('error', deferred.reject.bind(deferred));

  return deferred.promise;
};

module.exports.unzip = function(filename, outputStream) {
  var readableStream = fs.createReadStream(filename + EXT);
  var unzip = zlib.createUnzip();
  var deferred = q.defer();

  readableStream.pipe(unzip).pipe(outputStream)
    .on('end', deferred.resolve.bind(deferred))
    .on('error', deferred.reject.bind(deferred));

  return deferred.promise;
};
