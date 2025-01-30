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
		this.maxForce = 0.2;
		this.maxSpeed = 2;
		this.perceptionRadius = 50;
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
		if (this.position.x > w * 0.5) this.position.x = -w * 0.5;
		if (this.position.x < -w * 0.5) this.position.x = w * 0.5;
		if (this.position.y > h * 0.5) this.position.y = -h * 0.5;
		if (this.position.y < -h * 0.5) this.position.y = h * 0.5;
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

		return total == 0 ? steering : steering.divScalar(total).setLength(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
	}

	flock (boids) {
		this.acceleration.add(this.align(boids)).add(this.cohesion(boids)).add(this.separation(boids));
	}

	update (w, h) {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration).limit(this.maxSpeed);
		this.acceleration.multScalar(0);
		this.edges(w, h);
	}
}

class World {
	constructor() {
		this.flock = [];
		this.width = 700;
		this.height = 700;

		for (let a = 0; a < 200; a++) this.flock.push(new Boid(this.width, this.height));
	}

	draw (ctx) {
		ctx.fillStyle = '#134523';
		ctx.fillRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);

		ctx.fillStyle = '#000000';
		ctx.strokeStyle = '#88ff88';
		ctx.lineWidth = 1;

		this.flock.forEach(boid => boid.draw(ctx));

		ctx.lineWidth = 20;
		ctx.strokeRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
	}

	update () {
		this.flock.forEach(boid => {
			boid.flock(this.flock);
			boid.update(this.width, this.height);
		});
	}
}
