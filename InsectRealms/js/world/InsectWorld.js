import Camera from "./Camera.js";
import MapLoader from "./MapLoader.js";
import WorldObject from "./WorldObject.js";

class InsectWorld {
	constructor (resources, mapData) {
		this.resources = resources;
		this.width = 0;
		this.height = 0;
		this.scale = 1;
		this.debugMode = false;
		this.camera = new Camera(this, 0, 0);
		this.worldWidth = 10000;
		this.worldHeight = 10000;
		this.objects = [];
		this.drawableObjects = [];

		MapLoader.load(this, mapData, 2);
	}

	#drawGrid (ctx, cellSize = 50) {
		ctx.strokeStyle = '#f00';

		ctx.beginPath();

		for (let y = -this.worldHeight / 2; y < this.worldHeight / 2; y += cellSize) {
			ctx.moveTo(-this.worldWidth / 2, y);
			ctx.lineTo(this.worldWidth / 2, y);
		}

		for (let x = -this.worldWidth / 2; x < this.worldWidth / 2; x += cellSize) {
			ctx.moveTo(x, -this.worldWidth / 2);
			ctx.lineTo(x, this.worldWidth / 2);
		}

		ctx.stroke();
	}

	render (ctx, width, height) {
		const transform = ctx.getTransform();

		ctx.translate(width / 2, height / 2);
		this.camera.update(ctx);

		this.drawableObjects = this.objects.filter(object => WorldObject.isInViewport(object, this.camera.position.x, this.camera.position.y, this.camera.scale, this.width, this.height));
		
		if (this.debugMode) {
			this.#drawGrid(ctx, 120);
			this.drawableObjects.forEach(object => object.drawDebug(ctx));
		} else {
			const cameraX = this.camera.position.x;
			const cameraY = this.camera.position.y;

			this.drawableObjects.forEach(object => { if (object.castShadow) object.drawShadow(ctx, '#00000088'); });
			this.drawableObjects.forEach(object => {
				if (object.isLayered) {
					object.draw(ctx, cameraX, cameraY, this.width, this.height);
				} else {
					object.draw(ctx);
				}
			});
		}

		ctx.setTransform(transform);
	}

	update (dt) {
		this.objects.forEach(object => object.update(dt));
	}

	resize (w, h) {
		this.width = w;
		this.height = h;
	}
}

export default InsectWorld;
