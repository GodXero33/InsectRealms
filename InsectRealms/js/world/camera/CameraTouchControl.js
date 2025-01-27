import Point from "../../extra/Point.js";

class CameraTouchControl {
	constructor (camera, pinchZoomFact, canvas) {
		this.camera = camera;
		this.pinchZoomFact = pinchZoomFact;
		this.canvas = canvas;
		this.touchdownPoint = null;
		this.pinchZoomStart = null;
		this.isEnabled = false;

		this.#initEvents();
	}

	#initEvents () {
		const options = { passive: false };

		window.addEventListener('touchstart', this.#touchstart.bind(this), options);
		window.addEventListener('touchend', this.#touchend.bind(this), options);
		window.addEventListener('touchmove', this.#touchmove.bind(this), options);
	}

	#touchstart (event) {
		if (event.target != this.canvas || !this.isEnabled) return;

		event.preventDefault();
		
		if (event.touches.length == 1) {
			const touch = event.touches[0];
			this.touchdownPoint = new Point(touch.clientX + this.camera.position.x * this.camera.scale, touch.clientY + this.camera.position.y * this.camera.scale);
		}

		if (event.touches.length == 2) {
			const touch1 = event.touches[0];
			const touch2 = event.touches[1];

			this.pinchZoomStart = {
				p1: new Point(touch1.clientX + this.camera.position.x * this.camera.scale, touch1.clientY + this.camera.position.y * this.camera.scale),
				p2: new Point(touch2.clientX + this.camera.position.x * this.camera.scale, touch2.clientY + this.camera.position.y * this.camera.scale)
			};
		}
	}

	#touchend (event) {
		this.touchdownPoint = null;
		this.pinchZoomStart = null;
	}

	#touchmove (event) {
		if (event.target != this.canvas || !this.isEnabled) return;
		
		event.preventDefault();
		
		if (event.touches.length == 1 && this.touchdownPoint) {
			const touch = event.touches[0];
			this.camera.position.x = (this.touchdownPoint.x - touch.clientX) / this.camera.scale;
			this.camera.position.y = (this.touchdownPoint.y - touch.clientY) / this.camera.scale;
		}

		if (event.touches.length == 2 && this.pinchZoomStart) {
			const touch1 = event.touches[0];
			const touch2 = event.touches[1];

			const dist1 = (this.pinchZoomStart.p1.x - this.pinchZoomStart.p2.x) ** 2 + (this.pinchZoomStart.p1.y - this.pinchZoomStart.p2.y) ** 2;
			const dist2 = (touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2;
			const deltaDist = dist2 - dist1;

			const newScale = this.camera.scale * (1 + this.camera.zoomingFact * Math.sign(deltaDist) * this.pinchZoomFact);
			this.camera.scale = newScale < this.camera.minZoom ? this.camera.minZoom : newScale > this.camera.maxZoom ? this.camera.maxZoom : newScale;

			this.pinchZoomStart.p1.x = touch1.clientX;
			this.pinchZoomStart.p1.y = touch1.clientY;
			this.pinchZoomStart.p2.x = touch2.clientX;
			this.pinchZoomStart.p2.y = touch2.clientY;
		}
	}
}

export default CameraTouchControl;
