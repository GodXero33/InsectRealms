class GrassGenerator {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
		this.bounds = this.generateSmoothPolygon(0, 0, 100, 400);
		this.centroid = this.computeCentroid();
		this.image = this.generateImage();
	}

	computeCentroid () {
		let sumX = 0, sumY = 0, count = this.bounds.length / 2;

		for (let i = 0; i < this.bounds.length; i += 2) {
			sumX += this.bounds[i];
			sumY += this.bounds[i + 1];
		}

		return { x: sumX / count, y: sumY / count };
	}

	getBoundingBox (expand) {
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

	downloadImage (canvas) {
		let link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = "water_area.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	generateImage () {
		let layers = 50;
		let minScale = 0.01;
		let maxScale = 1;

		let scaleIncrement = (maxScale - minScale) / (layers - 1);

		let bbox = this.getBoundingBox(maxScale * (maxScale - minScale));
		let canvas = document.createElement("canvas");
		canvas.width = bbox.width;
		canvas.height = bbox.height;
		let ctx = canvas.getContext("2d");
		const isDry = Math.random() > 0.1;

		for (let i = layers; i > 0; i--) {
			let scale = minScale + scaleIncrement * i;
			const rb = Math.random() * 100;
			this.drawPolygon(ctx, bbox, scale, `rgb(${rb}, ${Math.min(Math.random() * rb + rb + i * 2, isDry ? 255 : rb)}, ${rb})`);
		}

		let img = new Image();
		img.src = canvas.toDataURL();

		return img;
	}

	drawPolygon (ctx, bbox, expand, color) {
		ctx.fillStyle = color;
		ctx.beginPath();

		for (let i = 0; i < this.bounds.length; i += 2) {
			let dx = this.bounds[i] - this.centroid.x;
			let dy = this.bounds[i + 1] - this.centroid.y;
			let len = Math.sqrt(dx * dx + dy * dy);
			let x = (this.bounds[i] * expand + (dx / len)) - bbox.minX;
			let y = (this.bounds[i + 1] * expand + (dy / len)) - bbox.minY;

			if (i == 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}

		ctx.closePath();
		ctx.fill();
	}

	generateSmoothPolygon (cx, cy, radius, vertexCount) {
		let points = [];

		for (let i = 0; i < vertexCount; i++) {
			let angle = (i / vertexCount) * Math.PI * 2;
			let r = radius * (0.9 + Math.random() * 0.4);
			let x = cx + Math.cos(angle) * r;
			let y = cy + Math.sin(angle) * r;
			points.push(x, y);
		}

		return points;
	}
}

export default GrassGenerator;
