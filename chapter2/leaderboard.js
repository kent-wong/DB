var redis = require('redis');
var client = redis.createClient();

function LeaderBoard(key) {
	this.key = key;
}

LeaderBoard.prototype.addUser = function(username, score) {
	client.zadd([this.key, score, username], function(err, replies) {
		console.log('User:', username, 'added to the leaderboard!');
	});
}

LeaderBoard.prototype.removeUser = function(username) {
	client.zrem(this.key, username, function(err, replies) {
		if (!err) {
			console.log("User", username, "removed successfully!");
		} else {
			console.log("Remove user:", username, "failed!");
		}
	});
}

LeaderBoard.prototype.getUserScoreAndRank = function(username) {
	var leaderboardKey = this.key;
	client.zscore(leaderboardKey, username, function(err, zscoreReply) {
		client.zrevrank(leaderboardKey, username, function(err, zrevrankReply) {
			console.log("Details of " + username + ":");
			console.log("Score:" + zscoreReply + ", Rank: #" + (zrevrankReply+1));
		});
	});
}

LeaderBoard.prototype.showTopUsers = function(quantity) {
	client.zrevrange([this.key, 0, quantity-1, "WITHSCORES"], function(err, reply) {
		console.log("\nTop", quantity, "users:");
		for (var i = 0, rank = 1; i < reply.length; i += 2, rank += 1) {
			console.log("#" + rank, "User: " + reply[i] + ", score:", reply[i+1]);
		}
	});
}

LeaderBoard.prototype.getUsersAroundUser = function(username, quantity, callback) {
	var leaderboardKey = this.key;

	client.zrevrank(leaderboardKey, username, function(err, myrank) {
		var startOffset = Math.floor(myrank - (quantity/2) + 1);
		if (startOffset < 0) {
			startOffset = 0;
		}
		var endOffset = startOffset + quantity - 1;

		client.zrevrange([leaderboardKey, startOffset, endOffset, "WITHSCORES"],
				function(err, nameAndScores) {
					var users = [];
					for (var i = 0, rank = 1; i < nameAndScores.length; i += 2, rank += 1) {
						var user = {
							rank: startOffset + rank,
							score: nameAndScores[i+1],
							username: nameAndScores[i],
						};
						users.push(user);
					}
					callback(users);
				});
	});

}

var leaderBoard = new LeaderBoard("game-score");
leaderBoard.addUser("Arthur", 70);
leaderBoard.addUser("KC", 20);
leaderBoard.addUser("Maxwell", 10);
leaderBoard.addUser("Patrik", 30);
leaderBoard.addUser("Ana", 60);
leaderBoard.addUser("Felipe", 40);
leaderBoard.addUser("Renata", 50);
leaderBoard.addUser("Hugo", 80);
leaderBoard.removeUser("Arthur");

leaderBoard.getUserScoreAndRank("Maxwell");
leaderBoard.showTopUsers(3);

leaderBoard.getUsersAroundUser("Felipe", 5, function(users) {
	console.log("\nUsers around Felipe:");
	users.forEach(function(user) {
		console.log("#" + user.rank, "User: " + user.username + ", score:" + user.score);
	});
	client.quit();
});

