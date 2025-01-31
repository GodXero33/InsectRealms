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

	draw (ctx) {
		const angle = this.velocity.angle();
		const size = 10;

		const x1 = this.position.x + Math.cos(angle) * size;
		const y1 = this.position.y + Math.sin(angle) * size;
		const x2 = this.position.x + Math.cos(angle + Math.PI * 2 / 3) * size * 0.8;
		const y2 = this.position.y + Math.sin(angle + Math.PI * 2 / 3) * size * 0.8;
		const x3 = this.position.x + Math.cos(angle - Math.PI * 2 / 3) * size * 0.8;
		const y3 = this.position.y + Math.sin(angle - Math.PI * 2 / 3) * size * 0.8;
		const x4 = this.position.x;
		const y4 = this.position.y;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x4, y4);
		ctx.lineTo(x3, y3);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
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
	constructor (size, color, x, y, width, height) {
		this.size = size;
		this.color = color;
		this.boids = [];
		this.predatorFlock = null;

		for (let a = 0; a < size; a++) this.boids.push(new Boid(x, y, width, height));
	}

	draw (ctx) {
		ctx.fillStyle = this.color;
		ctx.strokeStyle = '#565656';

		this.boids.forEach(boid => boid.draw(ctx));
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
			this.flocks.push(new Flock(flock.count, flock.color, this.position.x, this.position.y, this.radius2, this.radius2));
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
