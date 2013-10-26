var five = require("johnny-five"),
	MaestroIOBoard = require("pololu-maestro-ioboard"),
	PololuMaestro = require("pololu-maestro"),
	LOG = require("winston"),
	IOBoard = require("ioboard"),
	BuildCat = require("./lib/cat.js"),
	BuildWatcher = require("./lib/watcher.js");;

var jenkins = "https://builds.apache.org/api/json";
var checkInterval = 10000;

process.on('uncaughtException', function(err) {
	console.error(err.stack);

	process.exit(1);
});

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

		var board = new five.Board({firmata: bridge});

		var head = new five.Servo(1);
		var g = new five.Led(8);
		var rR = new five.Led(2);
		var rB = new five.Led(4);
		var lR = new five.Led(5);
		var lB = new five.Led(7);

		board.repl.inject({
			head: head,
			g: g,
			rR: rR,
			rB: rB,
			lR: lR,
			lB: lB
		});

		var ptolemy = new BuildCat(head, g, rR, rB, lR, lB);
		ptolemy.demo();

		/*var watcher = new BuildWatcher(jenkins, checkInterval);
		watcher.on("failed", ptolemy.sad.bind(ptolemy));
		watcher.on("passed", ptolemy.happy.bind(ptolemy));
		watcher.on("building", ptolemy.building.bind(ptolemy));
		watcher.on("unstable", ptolemy.unstable.bind(ptolemy));*/
	});
});
