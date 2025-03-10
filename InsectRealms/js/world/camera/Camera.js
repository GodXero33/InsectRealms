import Vector from "../../extra/Vector.js";

class Camera {
	constructor (world, x, y) {
		this.world = world;
		this.position = new Vector(x, y);
		this.scale = 1;
		// this.rotation = 0;
		this.maxZoom = 5;
		this.minZoom = 1;
		this.panningSpeed = 2;
		this.zoomingFact = 0.1;
		this.keyControl = null;
		this.mouseControl = null;
		this.touchControl = null;
	}

	update (ctx) {
		if (this.keyControl) this.keyControl.update();
		
		// ctx.rotate(-this.rotation);
		ctx.scale(this.scale, this.scale);
		ctx.translate(-this.position.x, -this.position.y);
	}
}

export default Camera;
