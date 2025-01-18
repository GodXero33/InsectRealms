class CameraKeyControl {
	constructor () {
		this.moveUp = false;
		this.moveDown = false;
		this.moveRight = false;
		this.moveLeft = false;
		this.turnLeft = false;
		this.turnRight = false;
		this.zoomIn = false;
		this.zoomOut = false;

		this.#initEvents();
	}

	#initEvents () {
		window.addEventListener('keydown', this.#keydown.bind(this));
		window.addEventListener('keyup', this.#keyup.bind(this));
	}

	#keydown (event) {
		const code = event.code;

		if (code == 'KeyW') {
			this.moveUp = true;
			return;
		}
		
		if (code == 'KeyS') {
			this.moveDown = true;
			return;
		}

		if (code == 'KeyD') {
			this.moveRight = true;
			return;
		}

		if (code == 'KeyA') {
			this.moveLeft = true;
			return;
		}

		if (code == 'KeyE') {
			this.turnRight = true;
			return;
		}

		if (code == 'KeyQ') {
			this.turnLeft = true;
			return;
		}

		if (code == 'KeyZ') {
			this.zoomIn = true;
			return;
		}

		if (code == 'KeyX') {
			this.zoomOut = true;
		}
	}

	#keyup (event) {
		const code = event.code;

		if (code == 'KeyW') {
			this.moveUp = false;
			return;
		}
		
		if (code == 'KeyS') {
			this.moveDown = false;
			return;
		}

		if (code == 'KeyD') {
			this.moveRight = false;
			return;
		}

		if (code == 'KeyA') {
			this.moveLeft = false;
			return;
		}

		if (code == 'KeyE') {
			this.turnRight = false;
			return;
		}

		if (code == 'KeyQ') {
			this.turnLeft = false;
			return;
		}

		if (code == 'KeyZ') {
			this.zoomIn = false;
			return;
		}

		if (code == 'KeyX') {
			this.zoomOut = false;
		}
	}

	update (camera) {
		const movementSpeed = 200;
		const rotationSpeed = 0.01;
		const zoomingFact = 0.1;

		if (this.moveUp) {
			camera.position.y -= movementSpeed;
		}

		if (this.moveDown) {
			camera.position.y += movementSpeed;
		}

		if (this.moveLeft) {
			camera.position.x -= movementSpeed;
		}

		if (this.moveRight) {
			camera.position.x += movementSpeed;
		}

		if (this.turnLeft) {
			camera.rotation -= rotationSpeed;
		}

		if (this.turnRight) {
			camera.rotation += rotationSpeed;
		}

		if (this.zoomIn) {
			const newScale = camera.scale * (1 - zoomingFact);
			camera.scale = newScale < camera.minZoom ? camera.minZoom : newScale;
		}

		if (this.zoomOut) {
			const newScale = camera.scale * (1 + zoomingFact);
			camera.scale = newScale > camera.maxZoom ? camera.maxZoom : newScale;
		}
	}
}

export default CameraKeyControl;
