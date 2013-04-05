var querystring = require('querystring'),
        https = require('https'),
        crypto = require('crypto');
 
var MtGox = Class({
    client: null,
    initialize: function(options) {
        if (! options) {
            throw new Error('Please pass an options object to the constructor.');
        }
        
        if (! options.key) {
            throw new Error('Please pass options.key string to the constructor.');
        }
        
        if (! options.secret) {
            throw new Error('Please pass options.secret string to the constructor.');
        }
        

        this.client = new MtGoxClient(options.key, options.secret);
    },

    tracker: function(from, to, ircWrite) {
        this.client.query('1/BTCUSD/public/ticker', {}, function(response) {
            if (response && response.result === 'success') {
                ircWrite(
                    to, 
                    'MtGox,    Last[' + response.return.last.display_short + '/BTC' +
                    ']    High[' + response.return.high.display_short + 
                    ']    Low[' + response.return.low.display_short + 
                    ']    Volume[' + response.return.vol.display_short + ']'
                );

                console.log((new Date()) + '[' + to + '] MtGox, Successfully responded.');
            } else {
                ircWrite(t, "Bitstamp, ERROR: JSON Response couldn't parsed.");
                console.log((new Date()) + '[' + to + '] MtGox, ERROR: JSON Response couldn\'t parsed.');
            }
        });
    }
});

/**
 * Credit to: https://en.bitcoin.it/wiki/Node.js_Example
 */
function MtGoxClient(key, secret) {
        this.key = key;
        this.secret = secret;
}
MtGoxClient.prototype.query = function(path, args, callback) {
        var client = this;
 
        // if no args or invalid args provided, just reset the arg object
        if (typeof args != "object") args = {};
 
        // generate a nonce
        args['nonce'] = (new Date()).getTime() * 1000;
        // compute the post data
        var post = querystring.stringify(args);
        // compute the sha512 signature of the post data
        var hmac = crypto.createHmac('sha512', new Buffer(client.secret, 'base64'));
        hmac.update(post);
 
        // this is our query
        var options = {
                host: 'mtgox.com',
                port: 443,
                path: '/api/' + path,
                method: 'POST',
                agent: false,
                headers: {
                        'Rest-Key': client.key,
                        'Rest-Sign': hmac.digest('base64'),
                        'User-Agent': 'Mozilla/4.0 (compatible; MtGox node.js client)',
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Content-Length': post.length
                }
        };
 
        // run the query, buffer the data and call the callback
        var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var buffer = '';
                res.on('data', function(data) { buffer += data; });
                res.on('end', function() { if (typeof callback == "function") { callback(JSON.parse(buffer)); } });
        });
 
        // basic error management
        req.on('error', function(e) {
                console.log('warning: problem with request: ' + e.message);
        });
 
        // post the data
        req.write(post);
        req.end();
};

// Entry Point 
module.exports = MtGox;