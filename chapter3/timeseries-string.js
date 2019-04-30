function TimeSeries(client, namespace) {
	this.namespace = namespace;
	this.client = client;
	this.units = {
		second: 1,
		minute: 60,
		hour: 60 * 60,
		day: 24 * 60 * 60
	};

	this.granularities = {
		"1sec" : { name: "1sec", ttl: this.units.hour * 2, 
				duration: this.units.second },
		'1min' : { name: '1min', ttl: this.units.day * 7,
				duration: this.units.minute },
		'1hour': { name: '1hour', ttl: this.units.day * 60 ,
				duration: this.units.hour },
		'1day' : { name: '1day', ttl: null, duration: this.units.day }
	};
}

TimeSeries.prototype.insert = function(timestampInSeconds) {
	for (var granuName in this.granularities) {
		var granularity = this.granularities[granuName];
	}
}
