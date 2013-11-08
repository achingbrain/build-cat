var LOG = require("winston");

BuildCat = function(head, g, rR, rB, lR, lB) {
	this._head = head;
	this._green = g;
	this._rightRed = rR;
	this._rightBlue = rB;
	this._leftRed = lR;
	this._leftBlue = lB;

	this.happy();
};

BuildCat.prototype.shakeHead = function(speed) {
	this._head.moveBetween({range: [60, 120], interval: 1300});
}

BuildCat.prototype.happy = function() {
	LOG.info("BuildCat", "Happy cat");

	this._reset();

	this._green.pulse(3000);
};

BuildCat.prototype.sad = function() {
	LOG.info("BuildCat", "Sad cat");

	this._reset();

	this.shakeHead(1300);

	this._rightRed.on();
	this._leftRed.on();

	this._interval = setInterval(function() {
		this._rightRed.toggle();
		this._leftRed.toggle();
	}.bind(this), 500);
};

BuildCat.prototype.unstable = function() {
	LOG.info("BuildCat", "Unstable cat");

	this._reset();

	this._head.moveBetween({range: [60, 120], interval: 1300});

	this._rightRed.on();
	this._leftRed.on();

	this._green.pinMode = 0x01
	this._green.on();

	this._interval = setInterval(function() {
		this._rightRed.toggle();
		this._leftRed.toggle();
		this._green.toggle();
	}.bind(this), 500);
};

BuildCat.prototype.building = function() {
	this._reset();

	var lights = [
		this._rightRed,
		this._rightBlue,
		this._leftRed,
		this._leftBlue,
		this._green
	];

	this._interval = setInterval(function() {
		var rand = ~~(Math.random() * lights.length);

		lights[rand][Math.random() > 0.5 ? "on" : "off"]();
	}.bind(this), 10);
}

BuildCat.prototype.demo = function() {
	setTimeout(this.building.bind(this), 5000);
	setTimeout(this.sad.bind(this), 10000);
	setTimeout(this.building.bind(this), 15000);
	setTimeout(this.unstable.bind(this), 18000);
	setTimeout(this.building.bind(this), 22000);
	setTimeout(this.happy.bind(this), 25000);
}

BuildCat.prototype._reset = function() {
	this._head.stop();
	this._head.center();

	this._rightRed.stop();
	this._rightRed.off();

	this._leftRed.stop();
	this._leftRed.off();

	this._rightBlue.off();
	this._leftBlue.off();

	this._green.stop();
	this._green.off();

	if(this._interval) {
		clearInterval(this._interval);
	}
}

module.exports = BuildCat;
