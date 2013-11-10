var five = require("johnny-five"),
	MaestroIOBoard = require("pololu-maestro-ioboard"),
	PololuMaestro = require("pololu-maestro"),
	LOG = require("winston"),
	IOBoard = require("ioboard"),
	BuildCat = require("./lib/cat.js"),
	BuildWatcher = require("./lib/watcher.js");

// the url we'll watch for failing builds
var jenkins = "https://builds.apache.org/api/json";

// how often to poll the url
var checkInterval = 10000;

// make error messages slightly more useful
process.on("uncaughtException", function(err) {
	console.error(err.stack);

	process.exit(1);
});

// re-introduce old sweep behaviour..
five.Servo.prototype.moveBetween = function( opts ) {
	this.move(opts.range[0]);

	if ( this.interval ) {
		clearInterval( this.interval );
	}

	var index = 1;

	this.interval = setInterval(function() {
		if(index == opts.range.length) {
			index = 0;
		}

		this.move( opts.range[index] );

		index++;
	}.bind(this), opts.interval );

	return this;
};

PololuMaestro.find(PololuMaestro.SERIAL_MODES.USB_DUAL_PORT, function(maestro) {
	LOG.info("ptolemy", "Maestro ready");

	maestro.setSpeed(1, 30);

	new MaestroIOBoard(maestro, PololuMaestro.TYPES.MINI_MAESTRO_12, [
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.SERVO,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT,
		IOBoard.CONSTANTS.MODES.OUTPUT
	], function(bridge) {
		LOG.info("ptolemy", "Creating board");

		// the serial ports are already connected so we don't have to wait for a "ready" event
		new five.Board({firmata: bridge});

		var head = new five.Servo(1);
		var green = new five.Led(8);
		var rightR = new five.Led(2);
		var rightB = new five.Led(4);
		var leftR = new five.Led(5);
		var leftB = new five.Led(7);

		// set up the cat and the watcher
		var ptolemy = new BuildCat(head, green, rightR, rightB, leftR, leftB);
		var watcher = new BuildWatcher(jenkins, checkInterval);

		// set up listeners
		watcher.on("failed", ptolemy.sad.bind(ptolemy));
		watcher.on("passed", ptolemy.happy.bind(ptolemy));
		watcher.on("building", ptolemy.building.bind(ptolemy));
		watcher.on("unstable", ptolemy.unstable.bind(ptolemy));
	});
});
