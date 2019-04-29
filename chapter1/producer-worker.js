var redis = require("redis");
var queue = require("./queue");

var client = redis.createClient();
var logsQueue = new queue.Queue("logs", client);

var MAX = 5;
for (var i = 0; i < MAX; i++) {
	logsQueue.push("Hello world #" + i);
}
console.log("created " + MAX + " logs");
client.quit();
