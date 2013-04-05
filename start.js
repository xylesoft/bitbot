var irc = require('irc');
var Bitstamp = require('./bitstamp');
var MtGox = require('./mtgox');

// setup IRC client.
var client = new irc.Client('irc.domain.com', 'bitbot_test', {
    channels: ['#moose']
});

// Prepare Bitstamp lib
var bsApi = new Bitstamp({
	irc: client
});

// Prepare MtGox lib
var mtApi = new MtGox({
	key: 'ENTER KEY',
	secret: 'ENTER SECET',
});

// Listen to messages
client.addListener('message', function (from, to, message) {
	var msg = message.trim().split(' ');

	// check for "!"
	if (msg[0] && msg[0].substring(0,1) === "!") {
		switch (msg[0]) {
			case "!btc":
				// bitstamp
				bsApi.tracker(from, to, client.say.bind(client));
				
				// mtgox
				mtApi.tracker(from, to, client.say.bind(client));
				break;
			default:
				return;
		}
	}
});
