require('mootools');
var https 	= require('https');
var Q 		= require('q');

var bitstamp = Class({
	// Responsible for sending the current bitstamp Balance.
	tracker: function(from, to, ircWrite) {
		var that = this;
        console.log((new Date()) + '[' + from + '] Requesting bitstamp tracker.');

        // request ticker infomration
        var r = https.get('https://www.bitstamp.net/api/ticker/', function(res) {
            var data = '';
            var p = that;
            var f = from;
            var t = to;
            var w = ircWrite;

            if (res.statusCode == 200) {
                // collect data!
                res.on('data', function(chunk) {
                    data += chunk;
                });

                // respond with reply.
                res.on('end', function() {
                	var response = JSON.parse(data);
	        		if (response) {
	        			w(
	        				t, 
	        				'Bitstamp, Last[$' + parseFloat(response.last,2).toFixed(2) + '/BTC' +
	        				']    High[$' + parseFloat(response.high,2).toFixed(2) + 
	        				']    Low[$' + parseFloat(response.low,2).toFixed(2) + 
	        				']    Volume[' + parseFloat(response.volume,2).toFixed(2) + '/BTC]'
	        			);
		        		console.log((new Date()) + '[' + t + '] Bitstamp, Successfully responded.');
	        		} else {
		        		w(t, "Bitstamp, ERROR: JSON Response couldn't parsed.");
		        		console.log((new Date()) + '[' + t + '] Bitstamp, ERROR: JSON Response couldn\'t parsed.');
	        		}

                });
            } else {
            	console.log(t, "Bitstamp, ERROR: HTTP Status " + res.statusCode);
            }
        }).on('error', function(e) {
    		that.irc.say(to, "Bitstamp, ERROR: " + e.message);
        });
	},

	initialize: function(options) {
		if (! options) {
			throw new Error('Please pass an options object to the constructor.');
		}
	}
});

// Entry Point
module.exports = bitstamp;