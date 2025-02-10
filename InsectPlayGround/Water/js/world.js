class WaterPuls {
	constructor (x, y) {
		this.x = x;
		this.y = y;
		this.ts = 0;
		this.r = 10;
	}

	draw (ctx, x, y) {
		ctx.strokeStyle = '#fff';

		for (let a = 0; a < Math.PI * 0.5; a += 0.1) {
			if (this.ts + a > Math.PI * 0.5) continue;

			ctx.beginPath();
			ctx.arc(x + this.x, y + this.y, Math.sin(this.ts + a) * this.r, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	update () {
		this.ts += 0.02;
		this.r += 1;
	}
}

class WaterArea {
	constructor (bounds, x, y, centerX, centerY) {
		this.bounds = bounds;
		this.x = x;
		this.y = y;
		this.centerX = centerX;
		this.centerY = centerY;
		this.pulses = [];
	}

	draw (ctx) {
		ctx.fillStyle = '#9ff';

		ctx.beginPath();
		ctx.moveTo(this.x + this.bounds[0], this.y + this.bounds[1]);

		for (let a = 2; a < this.bounds.length; a += 2) {
			ctx.lineTo(this.x + this.bounds[a], this.y + this.bounds[a + 1]);
		}

		ctx.fill();
		ctx.clip();

		this.pulses.forEach(puls => puls.draw(ctx, this.x, this.y));
	}

	update () {
		this.pulses.forEach(puls => puls.update());
	}

	puls (x, y) {
		this.pulses.push(new WaterPuls(x, y));

		this.pulses = this.pulses.filter(puls => puls.ts < Math.PI * 0.5);
	}
}

class World {
	constructor () {
		this.mouse = { x: 0, y: 0 };
		this.waterAreas = [
			new WaterArea([-200, -200, -200, 200, 200, 200, 200, -200, 50, -300, -200, -200], 0, 0, 0, 50)
		];
	}

	draw (ctx) {
		this.waterAreas.forEach(waterArea => waterArea.draw(ctx));
	}
	
	update () {
		this.waterAreas.forEach(waterArea => waterArea.update());
	}

	addPuls (x, y, i) {
		this.waterAreas[0].puls(x, y);
	}
}
