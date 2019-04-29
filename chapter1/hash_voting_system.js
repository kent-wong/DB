var redis = require("redis");
var client = redis.createClient();

function saveLink(id, author, title, link) {
	client.hmset("link:" + id, "author", author, "title", title, "link", link, "score", 0);
}

function upVote(id) {
	client.hincrby("link:" + id, "score", 1);
}

function downVote(id) {
	client.hincrby("link:" + id, "score", -1);
}

function showDetails(id) {
	client.hgetall("link:" + id, function(err, replies) {
		console.log('Title:', replies['title']);
		console.log('Author:', replies['author']);
		console.log('Link:', replies['link']);
		console.log('Score:', replies['score']);
		console.log('---------------------------');
	});
}


saveLink(123, 'wangke', 'A book about programming', 'https://github.com/kent-wong');
upVote(123);
upVote(123);
downVote(123);
showDetails(123);


client.quit();
