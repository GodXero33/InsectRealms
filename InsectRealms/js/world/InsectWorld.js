import Camera from "./camera/Camera.js";
import WorldObject from "./WorldObject.js";

class InsectWorld {
	static MAX_LAYERS_COUNT = 10;

	constructor (resources) {
		this.resources = resources;
		this.width = 0;
		this.height = 0;
		this.scale = 1;
		this.debugMode = false;
		this.camera = new Camera(this, 0, 0);
		this.worldWidth = 0;
		this.worldHeight = 0;
		this.objects = [];
		this.drawableObjects = [];
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

	#drawGroundTexture (ctx) {
		const size = 400;
		const xs = this.worldWidth * 0.5 / size;
		const ys = this.worldHeight * 0.5 / size;

		for (let a = -xs - 1; a < xs + 2; a++)
			for (let b = -ys - 1; b < ys + 2; b++)
				ctx.drawImage(this.resources['ground-001'], a * size - size * 0.5, b * size - size * 0.5, size, size);
	}

	render (ctx, width, height) {
		const transform = ctx.getTransform();

		ctx.translate(width / 2, height / 2);
		this.camera.update(ctx);
		this.#drawGroundTexture(ctx);

		this.drawableObjects = this.objects.filter(object => WorldObject.isInViewport(object, this.camera.position.x, this.camera.position.y, this.camera.scale, this.width, this.height));
		const layeredObjects = this.drawableObjects.filter(object => object.isLayered);
		const nonLayeredObjects = this.drawableObjects.filter(object => !object.isLayered);
		const shadowCastingObjects = this.drawableObjects.filter(object => object.castShadow);
		
		if (this.debugMode) {
			this.#drawGrid(ctx, 120);
			this.drawableObjects.forEach(object => object.drawDebug(ctx));
		} else {
			const cameraX = this.camera.position.x;
			const cameraY = this.camera.position.y;

			nonLayeredObjects.forEach(object => object.draw(ctx));
			shadowCastingObjects.forEach(object => object.drawShadow(ctx, 0.5));
			
			for (let a = 0; a < InsectWorld.MAX_LAYERS_COUNT; a++) layeredObjects.forEach(object => object.drawLayer(ctx, cameraX, cameraY, this.width, this.height, a));
		}

		ctx.setTransform(transform);
	}

	update (dt) {
		this.objects.filter(object => object.updateOffViewport || (
			!object.updateOffViewport &&
			WorldObject.isInViewport(object, this.camera.position.x, this.camera.position.y, this.camera.scale, this.width, this.height)
		)).forEach(object => object.update(dt));
	}

	resize (w, h) {
		this.width = w;
		this.height = h;
	}
}

export default InsectWorld;
