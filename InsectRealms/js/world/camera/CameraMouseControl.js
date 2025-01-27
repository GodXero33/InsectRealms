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

		if (this.mousedownPoint) {
			this.camera.position.x = (this.mousedownPoint.x - event.x) / this.camera.scale;
			this.camera.position.y = (this.mousedownPoint.y - event.y) / this.camera.scale;
		}
	}

	#wheel (event) {
		if (!this.isEnabled) return;
		
		const newScale = this.camera.scale * (1 + this.camera.zoomingFact * Math.sign(event.deltaY));
		this.camera.scale = newScale < this.camera.minZoom ? this.camera.minZoom : newScale > this.camera.maxZoom ? this.camera.maxZoom : newScale;
	}
}

export default CameraMouseControl;
