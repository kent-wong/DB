//var redis = require("redis");
//var client = redis.createClient();


function Queue(queueName, redisClient) {
	this.queueName = queueName;
	this.redisClient = redisClient;
	this.queueKey = 'queues:' + queueName;
	// zero means no timeout
	this.timeout = 0;
}

Queue.prototype.size = function(callback) {
	this.redisClient.llen(this.queueKey, callback);
}

Queue.prototype.push = function(data) {
	this.redisClient.lpush(this.queueKey, data);
}

Queue.prototype.pop = function(callback) {
	this.redisClient.brpop(this.queueKey, this.timeout, callback);
}

exports.Queue = Queue
