class Ray {
	constructor () {
		this.a = { x: 0, y: 0 };
		this.b = { x: 0, y: 0 };
	}

	draw (ctx) {
		ctx.strokeStyle = '#ff0';

		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y);
		ctx.lineTo(this.b.x, this.b.y);
		ctx.stroke();
	}
}

class RayArray {
	constructor (range, spread, count) {
		this.range = range;
		this.spread = spread;
		this.count = count;

		this.rays = Array.from({ length: count }, () => new Ray());
	}

	draw (ctx) {
		this.rays.forEach(ray => ray.draw(ctx));
	}

	update (x, y, rotation, map) {
		const deltaAngle = this.spread / (this.count - 1);
		const offsetAngle = rotation - this.spread * 0.5;

		this.rays.forEach((ray, index) => {
			ray.a.x = x;
			ray.a.y = y;
			ray.b.x = x + Math.cos(deltaAngle * index + offsetAngle) * this.range;
			ray.b.y = y + Math.sin(deltaAngle * index + offsetAngle) * this.range;

			const bx = ray.b.x;
			const by = ray.b.y;
			let lowest = Infinity;

			map.forEach(bounds => {
				for (let a = 0; a < bounds.length - 2; a += 2) {
					const intersect = getIntersectionOfTwoLines(bounds[a], bounds[a + 1], bounds[a + 2], bounds[a + 3], ray.a.x, ray.a.y, bx, by);

					if (intersect && lowest > intersect[3]) {
						ray.b.x = intersect[0];
						ray.b.y = intersect[1];
						lowest = intersect[3];
					}
				}
			});
		});
	}
}

class Insect {
	constructor (x, y, size, rotation) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.rotation = rotation;
		this.lookAt = null;
		this.rayArray = new RayArray(400, Math.PI * 0.8, 10);
		this.controls = {
			up: false,
			down: false,
			left: false,
			right: false
		};
	}

	draw (ctx) {
		ctx.lineWidth = 2;

		this.rayArray.draw(ctx);

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);

		ctx.fillStyle = '#f00';
		ctx.fillRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);

		ctx.fillStyle = '#0f0';
		ctx.fillRect(this.size * 0.3, -this.size * 0.5, this.size * 0.2, this.size);

		ctx.restore();
	}

	lookAtTarget () {
		this.rotation = Math.atan2(this.y - this.lookAt.y, this.x - this.lookAt.x) + Math.PI;
	}

	update (map) {
		if (this.lookAt) this.lookAtTarget();

		this.rayArray.update(this.x, this.y, this.rotation, map);

		const speed = 2;

		if (this.controls.up) this.y -= speed;
		if (this.controls.down) this.y += speed;
		if (this.controls.left) this.x -= speed;
		if (this.controls.right) this.x += speed;
	}
}

class World {
	constructor () {
		this.insect = new Insect(0, 300, 50, 0);
		this.map = [
			[0, 50, 100, -50, -100, -50, -100, 50, 100, 50], // Circle 1
			[150, 200, 250, 200, 150, 100, 50, 100, 150, 200], // Circle 2
			[-200, -150, -100, -150, -200, -250, -300, -250, -200, -150], // Circle 3
			[300, 350, 400, 350, 300, 250, 200, 250, 300, 350], // Circle 4
			[-300, -350, -400, -350, -300, -250, -200, -250, -300, -350], // Circle 5
			[50, 100, 150, 100, 50, 0, -50, 0, 50, 100], // Circle 6
			[200, 250, 300, 250, 200, 150, 100, 150, 200, 250], // Circle 7
			[-100, -50, 0, -50, -100, -150, -200, -150, -100, -50], // Circle 8
			[400, 450, 500, 450, 400, 350, 300, 350, 400, 450], // Circle 9
			[-400, -450, -500, -450, -400, -350, -300, -350, -400, -450], // Circle 10
			[0, 50, 100, 50, 0, -50, -100, -50, 0, 50], // Circle 11
			[250, 300, 350, 300, 250, 200, 150, 200, 250, 300], // Circle 12
			[-250, -200, -150, -200, -250, -300, -350, -300, -250, -200], // Circle 13
			[100, 150, 200, 150, 100, 50, 0, 50, 100, 150], // Circle 14
			[-100, -150, -200, -150, -100, -50, 0, -50, -100, -150], // Circle 15
			[50, 100, 150, 100, 50, 0, -50, 0, 50, 100], // Circle 16
			[300, 350, 400, 350, 300, 250, 200, 250, 300, 350], // Circle 17
			[-300, -350, -400, -350, -300, -250, -200, -250, -300, -350], // Circle 18
			[200, 250, 300, 250, 200, 150, 100, 150, 200, 250], // Circle 19
			[0, 50, 100, 50, 0, -50, -100, -50, 0, 50]
		];
		this.mouse = { x: 0, y: 0 };

		this.insect.lookAt = this.mouse;
	}

	draw (ctx) {
		this.insect.draw(ctx);

		ctx.strokeStyle = '#00f';
		ctx.lineWidth = 5;

		this.map.forEach(bounds => {
			if (bounds.length < 4) return;

			ctx.beginPath();
			ctx.moveTo(bounds[0], bounds[1]);

			for (let a = 2; a < bounds.length; a += 2) {
				ctx.lineTo(bounds[a], bounds[a + 1]);
			}

			ctx.stroke();
		});
	}

	update () {
		this.insect.update(this.map);
	}
}
