class WaterArea {
	constructor (bounds, x, y) {
		this.bounds = bounds;
		this.x = x;
		this.y = y;
	}

	draw (ctx) {
		ctx.fillStyle = '#9ff';

		ctx.beginPath();
		ctx.moveTo(this.x + this.bounds[0], this.y + this.bounds[1]);

		for (let a = 2; a < this.bounds.length; a += 2) {
			ctx.lineTo(this.x + this.bounds[a], this.y + this.bounds[a + 1]);
		}

		ctx.fill();
	}

	update () {}
}

class World {
	constructor () {
		this.mouse = { x: 0, y: 0 };
		this.waterAreas = [
			new WaterArea(this.generateSmoothPolygon(0, 0, 200, 20), 0, 0, 0, 50)
		];
	}

	generateSmoothPolygon (cx, cy, radius, vertexCount) {
		let points = [];

		for (let i = 0; i < vertexCount; i++) {
			let angle = (i / vertexCount) * Math.PI * 2;
			let r = radius * (0.8 + Math.random() * 0.4); // Randomize radius a bit for natural look
			let x = cx + Math.cos(angle) * r;
			let y = cy + Math.sin(angle) * r;
			points.push(x, y);
		}

		return points;
	}

	draw (ctx) {
		this.waterAreas.forEach(waterArea => waterArea.draw(ctx));
	}
	
	update () {
		this.waterAreas.forEach(waterArea => waterArea.update());
	}
}
