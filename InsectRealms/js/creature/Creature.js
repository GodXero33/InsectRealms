import Point from '../geo/Point.js';

class Creature {
	constructor (x, y, width, height, rotation = 0) {
		this.position = new Point(x, y);
		this.width = width;
		this.height = height;
		this.rotation = rotation;
	}

	static isInViewport (creature, width, height) {
		return true;
	}

	draw (ctx) {}

	update (dt) {}
}

export default Creature;
