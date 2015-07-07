var querystring = require('querystring');
var http = require('http');

function httpPost(filename, content, callback) {
  filename = './files/' + filename;

  var postData = querystring.stringify({
    filename: filename,
    content: content
  });

     console.log(postData)
  var postOptions = {
    host: '127.0.0.1',
    port: '3000',
    path: '/gzip',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var postReq = http.request(postOptions, function(res) {
    var response = [];

    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response.push(chunk);
    });
    res.on('end', function(err) {
      callback(err, response.join(''));
    })
  });

  // post
  postReq.write(postData);
  postReq.end();
}

function httpGet(queryObj, callback) {
  if (!queryObj) {
    return;
  }

  queryObj.filename = './files/' + queryObj.filename;

  var options = {
    host: '127.0.0.1',
    port: '3000',
    path: '/ungzip?' + querystring.stringify(queryObj),
    method: 'GET'
  };

  // Set up the request
  var postReq = http.request(options, function(res) {
    var response = [];

    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response.push(chunk);
    });
    res.on('end', function(err) {
      callback(err, response.join(''));
    })
  });

  // post the data
  postReq.end();
}

module.exports.post = httpPost;
module.exports.get = httpGet;
