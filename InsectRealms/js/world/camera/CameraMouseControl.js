import Point from "../../extra/Point.js";

class CameraMouseControl {
	constructor (camera, canvas) {
		this.camera = camera;
		this.canvas = canvas;
		this.mousedownPoint = null;
		this.isEnabled = false;

		this.#initEvents();
	}

	#initEvents () {
		window.addEventListener('mousedown', this.#mousedown.bind(this));
		window.addEventListener('mouseup', this.#mouseup.bind(this));
		window.addEventListener('mousemove', this.#mousemove.bind(this));
		window.addEventListener('wheel', this.#wheel.bind(this));
		window.addEventListener('contextmenu', (event) => event.preventDefault());
	}

	#mousedown (event) {
		if (event.target != this.canvas || !this.isEnabled) return;
		
		if (event.button == 0) {
			this.mousedownPoint = new Point(event.x + this.camera.position.x * this.camera.scale, event.y + this.camera.position.y * this.camera.scale);
		}
	}

	#mouseup (event) {
		if (event.button == 0) {
			this.mousedownPoint = null;
		}
	}

	#mousemove (event) {
		if (!this.isEnabled) return;

		const camera = this.camera;
		const canvasWidth = camera.world.width;
		const canvasHeight = camera.world.height;
		const worldWidth = camera.world.worldWidth;
		const worldHeight = camera.world.worldHeight;

		if (this.mousedownPoint) {
			camera.position.x = (this.mousedownPoint.x - event.x) / camera.scale;
			camera.position.y = (this.mousedownPoint.y - event.y) / camera.scale;

			if (camera.position.x < (canvasWidth - worldWidth) / 2) camera.position.x = (canvasWidth - worldWidth) / 2;
			if (camera.position.y < (canvasHeight - worldHeight) / 2) camera.position.y = (canvasHeight - worldHeight) / 2;
			if (camera.position.x > (worldWidth - canvasWidth) / 2) camera.position.x = (worldWidth - canvasWidth) / 2;
			if (camera.position.y > (worldHeight - canvasHeight) / 2) camera.position.y = (worldHeight - canvasHeight) / 2;
		}
	}

	#wheel (event) {
		if (!this.isEnabled) return;
		
		const newScale = this.camera.scale * (1 + this.camera.zoomingFact * Math.sign(event.deltaY));
		this.camera.scale = newScale < this.camera.minZoom ? this.camera.minZoom : newScale > this.camera.maxZoom ? this.camera.maxZoom : newScale;
	}
}

export default CameraMouseControl;
