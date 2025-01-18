import Point from "./geo/Point.js";
import CameraKeyControl from "./CameraKeyControl.js";

class Camera {
	constructor (x, y) {
		this.scale = 1;
		this.position = new Point(x, y);
		this.rotation = 0;
		this.maxZoom = 5;
		this.minZoom = 0.2;

		this.control = new CameraKeyControl();
	}

	update (ctx) {
		this.control.update(this);
		ctx.rotate(-this.rotation);
		ctx.scale(this.scale, this.scale);
		ctx.translate(-this.position.x, -this.position.y);
	}
}

export default Camera;
