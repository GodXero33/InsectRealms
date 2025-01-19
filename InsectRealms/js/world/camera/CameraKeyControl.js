class CameraKeyControl {
	constructor (camera) {
		this.camera = camera;
		this.moveUp = false;
		this.moveDown = false;
		this.moveRight = false;
		this.moveLeft = false;
		/* this.turnLeft = false;
		this.turnRight = false; */
		this.zoomIn = false;
		this.zoomOut = false;

		this.camera.keyControl = this;

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

		/* if (code == 'KeyE') {
			this.turnRight = true;
			return;
		}

		if (code == 'KeyQ') {
			this.turnLeft = true;
			return;
		} */

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

		/* if (code == 'KeyE') {
			this.turnRight = false;
			return;
		}

		if (code == 'KeyQ') {
			this.turnLeft = false;
			return;
		} */

		if (code == 'KeyZ') {
			this.zoomIn = false;
			return;
		}

		if (code == 'KeyX') {
			this.zoomOut = false;
		}
	}

	update () {
		const camera = this.camera;
		const movementSpeed = camera.panningSpeed;
		// const rotationSpeed = 0.01;
		const zoomingFact = camera.zoomingFact;
		const canvasWidth = camera.world.width;
		const canvasHeight = camera.world.height;
		const worldWidth = camera.world.worldWidth;
		const worldHeight = camera.world.worldHeight;

		if (this.moveUp) {
			camera.position.y -= movementSpeed;

			if (camera.position.y < (canvasHeight - worldHeight) / 2) camera.position.y = (canvasHeight - worldHeight) / 2;
		}

		if (this.moveDown) {
			camera.position.y += movementSpeed;

			if (camera.position.y > (worldHeight - canvasHeight) / 2) camera.position.y = (worldHeight - canvasHeight) / 2;
		}

		if (this.moveLeft) {
			camera.position.x -= movementSpeed;

			if (camera.position.x < (canvasWidth - worldWidth) / 2) camera.position.x = (canvasWidth - worldWidth) / 2;
		}

		if (this.moveRight) {
			camera.position.x += movementSpeed;

			if (camera.position.x > (worldWidth - canvasWidth) / 2) camera.position.x = (worldWidth - canvasWidth) / 2;
		}

		/* if (this.turnLeft) {
			camera.rotation -= rotationSpeed;
		}

		if (this.turnRight) {
			camera.rotation += rotationSpeed;
		} */

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
