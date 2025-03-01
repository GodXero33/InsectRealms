import Vector from "../extra/Vector.js";

class WorldObject {
	constructor (x, y, rotation, width, height) {
		this.position = new Vector(x, y);
		this.rotation = rotation;
		this.width = width;
		this.height = height;
		this.updateOffViewport = true;
		this.isLayered = false;
		this.castShadow = true;
	}

	static isInViewport (worldObject, cameraX, cameraY, cameraScale, viewPortWidth, viewPortHeight) {
		const halfViewportWidth = (viewPortWidth / cameraScale) / 2;
		const halfViewportHeight = (viewPortHeight / cameraScale) / 2;
		const viewportLeft = cameraX - halfViewportWidth;
		const viewportRight = cameraX + halfViewportWidth;
		const viewportTop = cameraY - halfViewportHeight;
		const viewportBottom = cameraY + halfViewportHeight;
		const objLeft = worldObject.position.x - worldObject.width / 2;
		const objRight = worldObject.position.x + worldObject.width / 2;
		const objTop = worldObject.position.y - worldObject.height / 2;
		const objBottom = worldObject.position.y + worldObject.height / 2;

		return objRight > viewportLeft && objLeft < viewportRight && objBottom > viewportTop && objTop < viewportBottom;
	}

	drawDebug (ctx, color = '#f00') {
		ctx.fillStyle = color;
		
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.fillRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
		ctx.restore();
	}

	drawShadow (ctx, color) {}

	draw (ctx) {}

	update (dt) {}
}

export default WorldObject;
