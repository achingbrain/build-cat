var restify = require("restify"),
	LOG = require("winston"),
	EventEmitter = require("events").EventEmitter;

var STATUSES = {
	BUILDING: 0,
	PASSING: 1,
	UNSTABLE: 2,
	FAILING: 3
};

var BuildWatcher = function(host, resource, checkInterval) {
	var lastStatus;

	// runs every 10 seconds
	var checkStatus = function() {
		LOG.info("BuildWatcher", "Sending request to ", url);

		var client = restify.createJsonClient({
			url: host
		});
		client.get(resource, function(error, request, response, result) {
			if ( ! error ) {
				if( result.jobs ) {
					var currentStatus;
					var jobStatus = [];

					result.jobs.forEach(function(job) {
						if(job.color == "red") {
							jobStatus.push(STATUSES.FAILING);
						} else if(job.color == "yellow") {
							jobStatus.push(STATUSES.UNSTABLE);
						} else if(job.color.substr(job.color.length - "_anime".length) == "_anime") {
							jobStatus.push(STATUSES.BUILDING);
						} else if(job.color == "blue") {
							jobStatus.push(STATUSES.PASSING);
						}
					});

					if(jobStatus.indexOf(STATUSES.FAILING) != -1) {
						LOG.info("BuildWatcher", "Builds are failing");

						currentStatus = STATUSES.FAILING;
					} else if(jobStatus.indexOf(STATUSES.UNSTABLE) != -1) {
						LOG.info("BuildWatcher", "Builds are unstable");

						currentStatus = STATUSES.UNSTABLE;
					} else if(jobStatus.indexOf(STATUSES.BUILDING) != -1) {
						LOG.info("BuildWatcher", "Builds are building");

						currentStatus = STATUSES.BUILDING;
					} else if(jobStatus.indexOf(STATUSES.PASSING) != -1) {
						LOG.info("BuildWatcher", "Builds are passing");

						currentStatus = STATUSES.PASSING;
					}

					if(lastStatus != currentStatus) {
						lastStatus = currentStatus;

						if(currentStatus == STATUSES.FAILING) {
							this.emit("failed");
						} else if(currentStatus == STATUSES.BUILDING) {
							this.emit("building");
						} else if(currentStatus == STATUSES.PASSING) {
							this.emit("passed");
						} else if(currentStatus == STATUSES.UNSTABLE) {
							this.emit("unstable");
						}
					}
				} else {
					LOG.error("BuildWatcher", "No jobs were present in JSON response");
					LOG.error(body);
				}
			} else {
				LOG.error("BuildWatcher", "Could not load Jenkins data", error.message);
			}

			// check again in 10 seconds
			setTimeout(checkStatus, 10000);
		}.bind(this));
	}.bind(this);
	checkStatus();
};

//} extends EventEmmiter
BuildWatcher.prototype = Object.create(EventEmitter.prototype);

module.exports = BuildWatcher;