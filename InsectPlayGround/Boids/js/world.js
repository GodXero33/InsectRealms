class Boid {
	constructor () {
		this.position = { x: 0, y: 0 };
		this.velocity = { x: 0, y: 0 };
		this.acceleration = { x: 0, y: 0 };
		this.maxForce = 0.005;
		this.maxSpeed = 1;

		this.position.x = Math.random() * 700 - 350;
		this.position.y = Math.random() * 700 - 350;

		this.velocity.x = Math.random() * 1 - 0.5;
		this.velocity.y = Math.random() * 1 - 0.5;
	}

	draw (ctx) {
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.position.x, this.position.y);
	}

	align (boids) {
		let steering = { x: 0, y: 0 };
		let perception = 50;
		let total = 0;

		boids.forEach(boid => {
			if (boid == this || (boid.position.x - this.position.x) ** 2 + (boid.position.y - this.position.y) ** 2 < perception ** 2) return;

			steering.x += boid.velocity.x;
			steering.y += boid.velocity.y;
			total++;
		});

		if (total != 0) {
			steering.x /= total;
			steering.y /= total;

			let limiter = this.maxSpeed / Math.sqrt(steering.x * steering.x + steering.y * steering.y);

			steering.x *= limiter;
			steering.y *= limiter;

			steering.x -= this.velocity.x;
			steering.y -= this.velocity.y;

			const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);

			if (magnitude > this.maxForce) {
				steering.x *= this.maxForce / magnitude;
				steering.y *= this.maxForce / magnitude;
			}
		}

		return steering;
	}

	separation (boids) {
		let perception = 24;
		let steering = { x: 0, y: 0 };
		let total = 0;

		boids.forEach(boid => {
			const dis = (boid.position.x - this.position.x) ** 2 + (boid.position.y - this.position.y) ** 2;

			if (boid == this || dis < perception ** 2) return;

			let diff = { x: this.position.x - boid.position.x, y: this.position.y - boid.position.y };
			diff.x /= dis;
			steering.x += diff.x;
			steering.y += diff.y;
			total++;
		});

		if (total != 0) {
			steering.x /= total;
			steering.y /= total;

			const dis = steering.x * steering.x + steering.y * steering.y;

			steering.x *= this.maxSpeed / dis;
			steering.y *= this.maxSpeed / dis;

			steering.x += this.velocity.x;
			steering.y += this.velocity.y;

			const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);

			if (magnitude > this.maxForce) {
				steering.x *= this.maxForce / magnitude;
				steering.y *= this.maxForce / magnitude;
			}
		}

		return steering;
	}

	cohesion (boids) {
		let perception = 50;
		let steering = { x: 0, y: 0 };
		let total = 0;

		boids.forEach(boid => {
			const dis = (boid.position.x - this.position.x) ** 2 + (boid.position.y - this.position.y) ** 2;

			if (boid == this || dis < perception ** 2) return;

			steering.x += boid.position.x;
			steering.y += boid.position.y;
			total++;
		});
		
		if (total != 0) {
			steering.x /= total;
			steering.y /= total;
			steering.x -= this.position.x;
			steering.y -= this.position.y;

			const dis = steering.x * steering.x + steering.y * steering.y;

			steering.x *= this.maxSpeed / dis;
			steering.y *= this.maxSpeed / dis;
			
			steering.x -= this.velocity.x;
			steering.y -= this.velocity.y;
			
			const magnitude = Math.sqrt(steering.x * steering.x + steering.y * steering.y);

			if (magnitude > this.maxForce) {
				steering.x *= this.maxForce / magnitude;
				steering.y *= this.maxForce / magnitude;
			}
		}

		return steering;
	}

	flock (boids) {
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let separation = this.separation(boids);

		this.acceleration.x = alignment.x;
		this.acceleration.y = alignment.y;

		this.acceleration.x = cohesion.x;
		this.acceleration.y = cohesion.y;

		this.acceleration.x = separation.x;
		this.acceleration.y = separation.y;
	}

	update () {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.x += this.acceleration.x;
		this.velocity.y += this.acceleration.y;

		this.acceleration.x = 0;
		this.acceleration.y = 0;
	}
}

class World {
	constructor() {
		this.flock = [];

		for (let a = 0; a < 50; a++) this.flock.push(new Boid());
	}

	draw (ctx) {
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';

		ctx.beginPath();
		this.flock.forEach(boid => boid.draw(ctx));
		ctx.stroke();
	}

	update () {
		this.flock.forEach(boid => {
			boid.flock(this.flock)
			boid.update()
		});
	}
}
