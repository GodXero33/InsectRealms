import { map } from "../../../extra/Math.js";
import MapLoader from "../../MapLoader.js";
import WorldObject from "../../WorldObject.js";

class PineTree extends WorldObject {
	static LAYERS = 5;

	constructor (data, generateQuality) {
		super(data.x, data.y, data.rotation, data.size, data.size);

		const quality = generateQuality == MapLoader.GENERATE_QUALITY_HIGH ? 60 : generateQuality == MapLoader.GENERATE_QUALITY_NORMAL ? 40 : 20;
		const deltaAngle = Math.PI * 2 / quality;
		const size = data.size / 2;

		this.layers = Array.from({ length: PineTree.LAYERS }, (_, index) => {
			const scale = (PineTree.LAYERS - index) / PineTree.LAYERS;

			const points = new Array(quality * 2);

			for (let a = 0; a < quality; a++) {
				points[a * 2] = Math.cos(deltaAngle * a) * scale * size + Math.random() * 10;
				points[a * 2 + 1] = Math.sin(deltaAngle * a) * scale * size + Math.random() * 10;
			}

			return points;
		});
		this.colors = Array.from({ length: PineTree.LAYERS }, (_, index) => `#00${Math.floor(map(index, 0, PineTree.LAYERS, 50, 255)).toString(16).padStart(2, 0)}00`);
		this.isLayered = true;
		this.castShadow = true;
	}

	drawShadow (ctx, color) {
		const points = this.layers[0];
		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.moveTo(this.position.x + points[0], this.position.y + points[1]);

		for (let b = 0; b < points.length; b += 2) ctx.lineTo(this.position.x + points[b], this.position.y + points[b + 1]);

		ctx.fill();
	}

	draw (ctx, cx, cy, vw, vh) {
		for (let a = 0; a < PineTree.LAYERS; a++) {
			ctx.fillStyle = this.colors[a];
			const points = this.layers[a];
			const offsetX = 0;
			const offsetY = 0;

			ctx.beginPath();
			ctx.moveTo(this.position.x + points[0] + offsetX, this.position.y + points[1] + offsetY);

			for (let b = 0; b < points.length; b += 2) ctx.lineTo(this.position.x + points[b] + offsetX, this.position.y + points[b + 1] + offsetY);

			ctx.fill();
		}
	}
}

export default PineTree;
