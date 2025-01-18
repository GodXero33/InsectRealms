import Point from "../geo/Point.js";

class WorldObject {
	constructor (x, y, rotation, width, height) {
		this.position = new Point(x, y);
		this.rotation = rotation;
		this.width = width;
		this.height = height;
	}

	static isInViewport (worldObject, viewPortWidth, viewPortHeight) {
		return true;
	}

	drawDebug (ctx, color = '#f00') {
		ctx.fillStyle = color;
		
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.fillRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
		ctx.restore();
	}

	draw (ctx) {}

	update (dt) {}
}

export default WorldObject;
