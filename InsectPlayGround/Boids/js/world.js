class Vector {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add (vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	addScalar (scalar) {
		this.x += scalar;
		this.y += scalar;
		return this;
	}
	
	sub (vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	subScalar (scalar) {
		this.x -= scalar;
		this.y -= scalar;
		return this;
	}

	mult (vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	}

	multScalar (scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	div (vec) {
		if (vec.x != 0) this.x /= vec.x;
		if (vec.y != 0) this.y /= vec.y;
		return this;
	}

	divScalar (scalar) {
		if (scalar == 0) return this;
		
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	disSQRT (vec) {
		return (this.x - vec.x) ** 2 + (this.y - vec.y) ** 2;
	}

	dis (vec) {
		return Math.sqrt(this.disSQRT(vec));
	}

	lengthSQRT () {
		return this.x * this.x + this.y * this.y;
	}

	length () {
		return Math.sqrt(this.lengthSQRT());
	}

	normalize () {
		const len = this.length();

		if (len == 0) return this;

		this.x /= len;
		this.y /= len;
		return this;
	}

	setLength (length) {
		return this.normalize().multScalar(length);;
	}

	limit (max) {
		const lenSQ = this.lengthSQRT();

		if (lenSQ > max * max) this.normalize().multScalar(max);

		return this;
	}

	randomize () {
		this.x = Math.random() * 2 - 1;
		this.y = Math.random() * 2 - 1;
		
		return this.normalize();
	}

	clone () {
		return new Vector(this.x, this.y);
	}

	angle () {
		return Math.atan2(this.y, this.x);
	}
}

class Boid {
	constructor (w, h) {
		this.position = new Vector((Math.random() - 0.5) * w, (Math.random() - 0.5) * h);
		this.velocity = new Vector().randomize().setLength(Math.random() * 1 + 0.5);
		this.acceleration = new Vector();
		this.maxForce = 0.01;
		this.maxSpeed = 1;
		this.perceptionRadius = 50;
		this.edgeSteering = 0.1;
	}

	/* draw (ctx) {
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
	} */

	draw (ctx) {
		const size = 4;
		
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.velocity.angle());
		ctx.fillStyle = '#f0f';
		ctx.fillRect(-size * 1.8, -size, size * 3.6, size * 2);
		ctx.beginPath();
		ctx.arc(-size * 0.8, 0, size, 0, Math.PI * 2);
		ctx.arc(size, 0, size * 0.8, 0, Math.PI * 2);
		ctx.fillStyle = '#ff0';
		ctx.fill();
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
	constructor (size, color, width, height) {
		this.size = size;
		this.color = color;
		this.boids = [];
		this.predatorFlock = null;

		for (let a = 0; a < size; a++) this.boids.push(new Boid(width, height));
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

class World {
	constructor() {
		this.width = 800;
		this.height = 800;
		this.radius1 = 200;
		this.radius2 = 500;
		this.flocks = [
			new Flock(200, '#0a0', this.width, this.height),
			new Flock(200, '#0aa', this.width, this.height),
			new Flock(20, '#a00', this.width, this.height)
		];

		this.flocks[0].predatorFlock = this.flocks[2];
		this.flocks[1].predatorFlock = this.flocks[2];
	}

	draw (ctx) {
		this.flocks.forEach(flock => flock.draw(ctx));
	}

	update () {
		// this.flocks.forEach(flock => flock.update(this.width, this.height));
		this.flocks.forEach(flock => flock.updateR(-200, 200, this.radius1, this.radius2));
	}

	resize (w, h) {
		this.width = w;
		this.height = h;
	}
}
