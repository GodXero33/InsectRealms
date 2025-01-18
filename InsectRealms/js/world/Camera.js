import Point from "../extra/Point.js";
import CameraKeyControl from "./CameraKeyControl.js";

class Camera {
	constructor (world, x, y) {
		this.world = world;
		this.position = new Point(x, y);
		this.scale = 1;
		// this.rotation = 0;
		this.maxZoom = 5;
		this.minZoom = 1;
		this.panningSpeed = 2;
		this.zoomingFact = 0.1;

		this.control = new CameraKeyControl();
	}

	update (ctx) {
		this.control.update(this);
		// ctx.rotate(-this.rotation);
		ctx.scale(this.scale, this.scale);
		ctx.translate(-this.position.x, -this.position.y);
	}
}

export default Camera;
