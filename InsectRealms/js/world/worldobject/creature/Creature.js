import WorldObject from '../../WorldObject.js';

class Creature extends WorldObject {
	constructor (x, y, width, rotation, height) {
		super(x, y, rotation, width, height);
	}

	static isInViewport (creature, width, height) {
		return true;
	}

	draw (ctx) {}

	update (dt) {}
}

export default Creature;
