import Vector from "../../../../../extra/Vector.js";
import WorldObject from "../../../../WorldObject.js";

class Boid {
	constructor (x, y, w, h) {
		this.position = new Vector(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * h);
		this.velocity = new Vector().randomize().setLength(Math.random() * 1 + 0.5);
		this.acceleration = new Vector();
		this.maxForce = 0.01;
		this.maxSpeed = 1;
		this.perceptionRadius = 50;
		this.edgeSteering = 0.1;
	}

	draw (ctx, texture) {
		const angle = this.velocity.angle();
		
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.velocity.angle());
		ctx.drawImage(texture.texture, -texture.width * 0.5, -texture.height * 0.5, texture.width, texture.height);
		ctx.restore();
	}

	edges (w, h) {
		if (this.position.x > w * 0.5) this.velocity.x -= this.edgeSteering;
		if (this.position.x < -w * 0.5) this.velocity.x += this.edgeSteering;
		if (this.position.y > h * 0.5) this.velocity.y -= this.edgeSteering;
		if (this.position.y < -h * 0.5) this.velocity.y += this.edgeSteering;
	}

	circleEdges (x, y, r1, r2) {
		const dis = (x - this.position.x) ** 2 + (y - this.position.y) ** 2;
		const dir = this.position.clone();
		dir.x -= x;
		dir.y -= y;
		const angle = dir.angle();

		if (dis < r1 * r1) {
			this.velocity.x += Math.cos(angle) * this.edgeSteering * 0.5;
			this.velocity.y += Math.sin(angle) * this.edgeSteering * 0.5;
		}

		if (dis > r2 * r2) {
			this.velocity.x -= Math.cos(angle) * this.edgeSteering * 0.5;
			this.velocity.y -= Math.sin(angle) * this.edgeSteering * 0.5;
		}
	}

	align (boids) {
		let steering = new Vector();
		let total = 0;

		boids.forEach(boid => {
			if (boid == this || this.position.disSQRT(boid.position) > this.perceptionRadius * this.perceptionRadius) return;

			steering.add(boid.velocity);
			total++;
		});

		return total == 0 ? steering : steering.divScalar(total).setLength(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
	}

	cohesion (boids) {
		let steering = new Vector();
		let total = 0;

		boids.forEach(boid => {
			if (boid == this || this.position.disSQRT(boid.position) > this.perceptionRadius * this.perceptionRadius) return;

			steering.add(boid.position);
			total++;
		});

		return total == 0 ? steering : steering.divScalar(total).sub(this.position).setLength(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
	}

	separation (boids) {
		let steering = new Vector();
		let total = 0;

		boids.forEach(boid => {
			const dis = this.position.dis(boid.position);

			if (boid == this || dis > this.perceptionRadius) return;

			const diff = this.position.clone().sub(boid.position).divScalar(dis);
			total++;

			steering.add(diff);
		});

		return total == 0 ? steering : steering.divScalar(total).setLength(this.maxSpeed).sub(this.velocity).limit(this.maxForce * 2);
	}

	avoid (predators) {
		let steering = new Vector();
		let total = 0;

		predators.forEach(predator => {
			const dis = this.position.dis(predator.position);

			if (dis > this.perceptionRadius * 2) return;

			const diff = this.position.clone().sub(predator.position).divScalar(dis);
			total++;

			steering.add(diff);
		});

		return total == 0 ? steering : steering.divScalar(total).setLength(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
	}

	flock (boids, predators) {
		this.acceleration.add(this.align(boids)).add(this.cohesion(boids)).add(this.separation(boids));

		if (predators) this.acceleration.add(this.avoid(predators).multScalar(5));
	}

	update (w, h) {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration).limit(this.maxSpeed);
		this.acceleration.multScalar(0);
		this.edges(w, h);
	}

	updateR (x, y, r1, r2) {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration).limit(this.maxSpeed);
		this.acceleration.multScalar(0);
		this.circleEdges(x, y, r1, r2);
	}
}

class Flock {
	constructor (size, x, y, width, height, antData) {
		this.size = size;
		this.boids = [];
		this.predatorFlock = null;
		this.antTexture = { texture: null, width: 0, height: 0 };

		for (let a = 0; a < size; a++) this.boids.push(new Boid(x, y, width, height));
		
		this.#generateAntTexture(antData);
	}

	#generateAntTexture (antData) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		const radius = antData.size * 0.5;
		const width = radius * 3.6;
		const height = radius * 2;

		canvas.width = width;
		canvas.height = height;

		ctx.fillStyle = antData.color;

		ctx.beginPath();
		ctx.arc(-radius * 0.8 + width * 0.5, height * 0.5, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(radius +  width * 0.5, height * 0.5, radius * 0.8, 0, Math.PI * 2);
		ctx.fill();

		img.src = canvas.toDataURL();
		this.antTexture.texture = img;
		this.antTexture.width = width;
		this.antTexture.height = height;
	}

	draw (ctx) {
		this.boids.forEach(boid => boid.draw(ctx, this.antTexture));
	}

	update (width, height) {
		this.boids.forEach(boid => {
			boid.flock(this.boids, this.predatorFlock?.boids);
			boid.update(width, height);
		});
	}

	updateR (x, y, w, h) {
		this.boids.forEach(boid => {
			boid.flock(this.boids, this.predatorFlock?.boids);
			boid.updateR(x, y, w, h);
		});
	}
}

class AntColony extends WorldObject {
	constructor (data) {
		super(data.x, data.y, 0, data.radius2 * 2, data.radius2 * 2);

		this.miniMapColor = '#ff6655';
		this.radius1 = data.radius1;
		this.radius2 = data.radius2;
		this.flocks = [];
		this.updateOffViewport = false;

		data.flocks.forEach(flock => {
			this.flocks.push(new Flock(flock.count, this.position.x, this.position.y, this.radius2, this.radius2, flock.ant));
		});

		data.predators.forEach(predatorData => this.flocks[predatorData[0]].predatorFlock = this.flocks[predatorData[1]]);
	}

	draw (ctx) {
		this.flocks.forEach(flock => flock.draw(ctx));
	}

	update () {
		this.flocks.forEach(flock => flock.updateR(this.position.x, this.position.y, this.radius1, this.radius2));
	}
}

export default AntColony;
