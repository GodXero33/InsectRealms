class WaterAreaTriangleModel {
	constructor (bounds, x, y) {
		this.bounds = bounds;
		this.x = x;
		this.y = y;
		this.centroid = this.computeCentroid();
	}

	computeCentroid () {
		let xSum = 0, ySum = 0, areaSum = 0;
		let n = this.bounds.length / 2;

		for (let i = 0; i < this.bounds.length; i += 2) {
			let x0 = this.bounds[i], y0 = this.bounds[i + 1];
			let x1 = this.bounds[(i + 2) % this.bounds.length], 
				y1 = this.bounds[(i + 3) % this.bounds.length];

			let a = x0 * y1 - x1 * y0;
			xSum += (x0 + x1) * a;
			ySum += (y0 + y1) * a;
			areaSum += a;
		}

		let A = areaSum / 2;
		return {
			x: this.x + xSum / (6 * A),
			y: this.y + ySum / (6 * A)
		};
	}

	draw (ctx) {
		let cx = this.centroid.x;
		let cy = this.centroid.y;

		ctx.lineJoin = "round";

		for (let i = 0; i < this.bounds.length; i += 2) {
			let x0 = this.x + this.bounds[i], 
				y0 = this.y + this.bounds[i + 1];
			let x1 = this.x + this.bounds[(i + 2) % this.bounds.length], 
				y1 = this.y + this.bounds[(i + 3) % this.bounds.length];

			let gradient = ctx.createLinearGradient(x0, y0, cx, cy);
			gradient.addColorStop(0, "#0ff");
			gradient.addColorStop(1, "#066");

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.lineTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.closePath();
			ctx.fill();

			ctx.strokeStyle = gradient;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	update () {}
}

class WaterArea {
	constructor(bounds, x, y, color = "#9ff") {
		this.bounds = bounds;
		this.x = x;
		this.y = y;
		this.color = color;
		this.centroid = this.computeCentroid();
		this.image = this.generateImage();
	}

	computeCentroid() {
		let sumX = 0, sumY = 0, count = this.bounds.length / 2;
		for (let i = 0; i < this.bounds.length; i += 2) {
			sumX += this.bounds[i];
			sumY += this.bounds[i + 1];
		}
		return { x: sumX / count, y: sumY / count };
	}

	getBoundingBox(expand) {
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

		for (let i = 0; i < this.bounds.length; i += 2) {
			let dx = this.bounds[i] - this.centroid.x;
			let dy = this.bounds[i + 1] - this.centroid.y;
			let len = Math.sqrt(dx * dx + dy * dy);
			let x = this.bounds[i] + (dx / len) * expand;
			let y = this.bounds[i + 1] + (dy / len) * expand;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}

		return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
	}

	downloadImage(canvas) {
		let link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = "water_area.png"; // Change filename as needed
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	generateImage() {
		let layers = 50;  // Number of layers for the bush
		let minScale = 0.01;  // Smallest size for the center polygon
		let maxScale = 1;  // Maximum size of the bush

		// Calculate scale increment for each layer (evenly distributed between minScale and maxScale)
		let scaleIncrement = (maxScale - minScale) / (layers - 1);

		let bbox = this.getBoundingBox(maxScale * (maxScale - minScale));  // Get bounding box considering max scale
		let canvas = document.createElement("canvas");
		canvas.width = bbox.width;
		canvas.height = bbox.height;
		let ctx = canvas.getContext("2d");

		// Loop to draw the bush layers, each with increasing size
		for (let i = layers; i > 0; i--) {
			let scale = minScale + scaleIncrement * i;  // Evenly distribute scale from minScale to maxScale
			const rb = Math.random() * 100;
			this.drawPolygon(ctx, bbox, scale, `rgb(${rb}, ${Math.min(Math.random() * rb + rb + i * 2, 255)}, ${rb})`);
		}

		let img = new Image();
		img.src = canvas.toDataURL();

		this.downloadImage(canvas);  // If you want to auto-download the image, uncomment this line

		return img;
	}

	drawPolygon(ctx, bbox, expand, color) {
		ctx.fillStyle = color;
		ctx.beginPath();

		for (let i = 0; i < this.bounds.length; i += 2) {
			let dx = this.bounds[i] - this.centroid.x;
			let dy = this.bounds[i + 1] - this.centroid.y;
			let len = Math.sqrt(dx * dx + dy * dy);
			let x = (this.bounds[i] * expand + (dx / len)) - bbox.minX;
			let y = (this.bounds[i + 1] * expand + (dy / len)) - bbox.minY;

			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}

		ctx.closePath();
		ctx.fill();
	}

	draw(ctx) {
		ctx.drawImage(this.image, this.x - window.innerWidth * 0.5, this.y - window.innerHeight * 0.5);
	}

	update() {}
}

class World {
	constructor () {
		this.mouse = { x: 0, y: 0 };
		this.waterAreas = [
			new WaterArea(this.generateSmoothPolygon(0, 0, 100, 400), 0, 0, 0, 50)
		];
	}

	generateSmoothPolygon (cx, cy, radius, vertexCount) {
		let points = [];

		for (let i = 0; i < vertexCount; i++) {
			let angle = (i / vertexCount) * Math.PI * 2;
			let r = radius * (0.9 + Math.random() * 0.4); // Randomize radius a bit for natural look
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
