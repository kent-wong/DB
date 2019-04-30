var redis = require("redis");
var client = redis.createClient();

if (process.argv.length < 3) {
	console.log("ERROR: You need to specify a data type!");
	console.log("$ node using-timeseries.js [string|hash]");
	process.exit(1);
}

var datatype = process.argv[2];
// debug
console.log("datatype:", datatype);

client.flushall();

var timeseries = require("./timeseries-" + datatype);




client.quit();
