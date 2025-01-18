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

		MapLoader.load(this, mapData);
	}

	#drawGrid (ctx, cellSize = 50) {
		ctx.fillStyle = '#f00';

		for (let y = -this.worldHeight / 2; y < this.worldHeight / 2; y += cellSize) for (let x = -this.worldWidth / 2; x < this.worldWidth / 2; x += cellSize) ctx.fillRect(x - cellSize / 2 - 1, y - cellSize / 2 - 1, cellSize - 2, cellSize - 2);
	}

	render (ctx, width, height) {
		const transform = ctx.getTransform();

		ctx.translate(width / 2, height / 2);
		this.camera.update(ctx);

		const drawableObjects = this.objects.filter(object => WorldObject.isInViewport(object, this.width, this.height));
		
		if (this.debugMode) {
			this.#drawGrid(ctx, 120);
			drawableObjects.forEach(object => object.drawDebug(ctx));
		} else {
			drawableObjects.forEach(object => object.draw(ctx));
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
