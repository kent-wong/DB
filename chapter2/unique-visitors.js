var redis = require("redis");
var client = redis.createClient();

function addVisit(date, user) {
	var key = "visits:" + date;
	client.pfadd(key, user);
}

function count(dates) {
	var keys = [];
	dates.forEach(function(date, index) {
		keys.push("visits:" + date);
	});

	client.pfcount(keys, function(err, reply) {
		console.log("Dates:" + dates.join(', ') + " had " + reply + " visits.");
	});
}

function aggregateDate(date) {
	var key = "visits:" + date;
	var keys = ["visits:" + date];
	for (var i = 0; i < 24; i ++) {
		keys.push("visits:" + date + "T" + i);
	}

	// debug
	console.log("keys:", keys);

	client.pfmerge(keys, function(err, reply) {
		if (err) {
			console.log("pfmerge error:" + err);
		}
		console.log("Aggregated date:", date, "reply:", reply);
		client.pfcount(key, function(err, total) {
			if (err) {
				console.log("pfcount error:" + err);
			}
			console.log("Aggregated dates have:" + total + " visits.");
			client.quit();
		});
	});
}

var MAX_USERS = 200;
var TOTAL_VISITS = 1000;

for(var i = 0; i < TOTAL_VISITS; i ++) {
	var username = "user_" + Math.floor(1 + Math.random() * MAX_USERS);
	var hour = Math.floor(Math.random() * 24);
	addVisit("2018-01-01T" + hour, username);
}


count(['2018-01-01T0']);
count(['2018-01-01T5', '2018-01-01T6', '2018-01-01T7']);
aggregateDate('2018-01-01');
count(['2018-01-01']);

