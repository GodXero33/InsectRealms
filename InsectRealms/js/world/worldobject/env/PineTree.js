import WorldObject from "../../WorldObject.js";

class PineTree extends WorldObject {
	constructor (data) {
		super(data.x, data.y, data.rotation, data.width, data.height);
	}

	draw (ctx) {
		
	}
}

export default PineTree;
