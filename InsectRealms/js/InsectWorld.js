import Creature from "./creature/Creature.js";
import Camera from "./Camera.js";

class InsectWorld {
	constructor (resources) {
		this.resources = resources;
		this.width = 0;
		this.height = 0;
		this.scale = 1;
		this.creatures = [];
		this.debugMode = false;
		this.camera = new Camera(0, 0);
		this.width = 10000;
		this.height = 10000;
	}

	render (ctx, width, height) {
		const transform = ctx.getTransform();

		ctx.translate(width / 2, height / 2);
		this.camera.update(ctx);

		ctx.fillStyle = '#f00';
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

		const drawableCreatures = this.creatures.filter(creature => Creature.isInViewport(creature, this.width, this.height));
		
		if (this.debugMode) {
			drawableCreatures.forEach(creature => creature.drawDebug(ctx));
		} else {
			drawableCreatures.forEach(creature => creature.draw(ctx));
		}

		ctx.setTransform(transform);
	}

	update (dt) {
		if (this.debugMode) {
			this.creatures.forEach(creature => creature.updateDebug(dt));
		} else {
			this.creatures.forEach(creature => creature.update(dt));
		}
	}

	resize (w, h) {
		this.width = w;
		this.height = h;
	}
}

export default InsectWorld;
