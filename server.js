var http = require('http');
var url = require('url');
var querystring = require('querystring');

var QueryFile = require('./query-file');

var options = {
  PORT: 3000
};

http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url);
    var reqQuery = querystring.parse(reqUrl.query);
    var queryFile;

    var onSuccess = function(err, msg) {

      if (err) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(err));
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(msg || (reqQuery.method + ' performed'));
      }
    };

    switch(reqUrl.pathname) {
      case '/action':

        queryFile = new QueryFile(reqQuery.filename);

        if (typeof queryFile[reqQuery.method] === 'function') {
          queryFile[reqQuery.method](onSuccess);
        }

        break;

      case '/index':

        queryFile = new QueryFile();
        queryFile.index(function(err, files) {

          onSuccess(err, '<h3>Files:</h3><ul>' + files.map(function(file) {

              return '<li>' + file + '</li>';
          }).join(''), + '</ul>');

        });

        break;

      default:

        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 Not Found</h1>');
    }
  })
  .listen(options.PORT, '127.0.0.1');

console.log('Server is listening on port', options.PORT);
