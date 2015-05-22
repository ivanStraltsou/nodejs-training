var fs = require('fs');
var path = require('path');

function QueryFile(filename, extention, dir) {
  this.filename = filename || 'xxx';
  this.extention = extention || QueryFile.DEFAULT_EXTENTION;
  this.dir = dir || QueryFile.ROOT_DIR;

  this.base = this.getFileBase();
}

QueryFile.DEFAULT_EXTENTION = 'txt';
QueryFile.ROOT_DIR = 'files';

QueryFile.prototype.getFileBase = function(filename) {
  filename = filename || this.filename;

  return path.format({
    root: '/',
    dir: this.dir,
    base: filename + '.' + this.extention,
    name: filename || this.filename,
    ext: this.extention
  });
}

QueryFile.prototype.copy = function(callback) {
  var answered = false;
  var me = this;
  var rs, ws;

  fs.stat(this.base, function(err) {
    if (err) {
      return callback(err);
    }

    rs = fs.createReadStream(me.base);
    ws = fs.createWriteStream(me.getFileBase(me.filename + Date.now()));

    rs.pipe(ws);

    rs.on('error', done);
    ws.on('error', done);
    ws.on('close', function(ex) {
      done();
    });

    function done(err) {
      if (!answered) {
        answered = true;

        callback(err);
      }
    }
  });

};

QueryFile.prototype.delete = function(callback) {
  fs.unlink(this.base, callback);
};

QueryFile.prototype.index = function(callback) {
  var me = this;

  fs.readdir(this.dir, function(err, files) {

    callback(err, files.filter(function(file) {
      return path.parse(file).ext.substr(1) === me.extention;
    }));

  });
};

module.exports = QueryFile;
