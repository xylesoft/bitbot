var irc = require('irc');
var Bitstamp = require('./bitstamp');
var MtGox = require('./mtgox');

// setup IRC client.
var client = new irc.Client('irc.brad-x.com', 'bitbot_test', {
    channels: ['#h0ztest']
});

// Prepare Bitstamp lib
var bsApi = new Bitstamp({
	irc: client
});

// Prepare MtGox lib
var mtApi = new MtGox({
	key: 'a27731a5-4be2-41eb-ae10-75f7d2813dad',
	secret: 'Un98Y+uoEwfVFPsvMFVccW4lv1x8KkutaytaMw9caW7JvQwvDEMc4nLX/dQfDC/3TY1tZ6MOuKRv6rVy2QHR7g==',
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