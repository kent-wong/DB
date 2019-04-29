var redis = require("redis");
var client = redis.createClient();

function upVote(id) {
	var key = "article:" + id + ":votes";
	client.incr(key)
}

console.log("here")

function downVote(id) {
	var key = "article:" + id + ":votes";
	client.decr(key)
}

console.log("there")

function showResult(id) {
	var headlineKey = "article:" + id + ":headline";
	var voteKey = "article:" + id + ":votes";
	client.mget([headlineKey, voteKey], function(err, replies) {
		console.log('The article "' + replies[0] + '" has ' + replies[1] + ' votes');
	});
}

upVote(12345);
showResult(12345);

downVote(10001);
showResult(10001);

// a key don't exist
showResult(100);



client.quit();
