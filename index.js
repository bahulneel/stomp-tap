require('string.prototype.repeat');
var prettyjson = require('prettyjson');
var Stomp = require('stomp-client');
var Url = require('url');

function main(urn) {
  var info = Url.parse(urn);
  var destination = info.hash.substr(1);
  var vhost = info.path.substr(1);
  var auth = info.auth.split(/:/);
  var client = new Stomp(info.hostname, info.port || 61613, auth[0], auth[1], '1.1', vhost);

  client.connect(function(sessionId) {
    console.log('Connected');
    client.subscribe(destination, function(body, headers) {
      var jsBody;
      var heading = "-".repeat(process.stdout.columns / 2);
      console.log(heading);
      console.log(prettyjson.render(headers));
      console.log(heading);
      console.log(body);
      try {
        jsBody = JSON.parse(body);
        console.log(prettyjson.render(jsBody));
      } catch (e) {
      }
      if (headers.id) {
        client.ack(headers['message-id'], headers.id);
      }
    });
  });
}

main(process.argv[2]);
