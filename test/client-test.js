var fs = require('fs');

var buster = require('buster');
var client = require('../zip-client');

buster.testCase('client zip/unzip', {
  'client test': function(done) {

    var filename = 'test.txt';

    // This is an async file read
    fs.readFile('./files/' + filename, 'utf-8', function(err, data) {
      if (err) {
        console.log('FATAL An error occurred trying to read in the file: ' + err);
        process.exit(-2);
      }

      if (data) {
        client.post(filename, data, function() {

          client.get({
            filename: filename
          }, done(function(err, content) {
            buster.assert.equals(content, data);
          }));
        });

      } else {
        console.log('No data to post');
        process.exit(-1);
      }
    });
  }

});
