import { map } from "../../../extra/Math.js";
import MapLoader from "../../MapLoader.js";
import WorldObject from "../../WorldObject.js";

class PineTree extends WorldObject {
	static LAYERS = 8;
	static OFFSET_SCALE = 300;
	static NOISE_OFFSET = 10;

	constructor (data, generateQuality) {
		super(data.x, data.y, data.rotation, data.size, data.size);

		const quality = generateQuality == MapLoader.GENERATE_QUALITY_HIGH ? 60 : generateQuality == MapLoader.GENERATE_QUALITY_NORMAL ? 40 : 20;
		const deltaAngle = Math.PI * 2 / quality;
		const size = data.size / 2;

		this.layers = Array.from({ length: PineTree.LAYERS }, (_, index) => {
			const scale = (PineTree.LAYERS - index) / PineTree.LAYERS;

			const points = new Array(quality * 2);

			for (let a = 0; a < quality; a++) {
				points[a * 2] = Math.cos(deltaAngle * a) * scale * size + Math.random() * PineTree.NOISE_OFFSET;
				points[a * 2 + 1] = Math.sin(deltaAngle * a) * scale * size + Math.random() * PineTree.NOISE_OFFSET;
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

	drawDebug (ctx) {
		ctx.fillStyle = '#f00';

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.width * 0.5 - PineTree.NOISE_OFFSET, 0, Math.PI * 2, false);
		ctx.fill();
	}

	drawLayer (ctx, cx, cy, vw, vh, layer) {
		if (layer >= PineTree.LAYERS) return;

		const extendedVw = vw + this.width + PineTree.OFFSET_SCALE;
		const extendedVh = vh + this.width + PineTree.OFFSET_SCALE;

		ctx.fillStyle = this.colors[layer];
		const points = this.layers[layer];
		const layerDepthFactor = (layer + 1) / PineTree.LAYERS;
		const treeScreenX = this.position.x - cx;
		const treeScreenY = this.position.y - cy;
		const distanceToLeft = treeScreenX;
		const distanceToRight = extendedVw - treeScreenX;
		const distanceToTop = treeScreenY;
		const distanceToBottom = extendedVh - treeScreenY;
		const offsetX = layerDepthFactor * (distanceToLeft < distanceToRight ? -distanceToLeft / extendedVw : distanceToRight / extendedVw) * PineTree.OFFSET_SCALE;
		const offsetY = layerDepthFactor * (distanceToTop < distanceToBottom ? -distanceToTop / extendedVh : distanceToBottom / extendedVh) * PineTree.OFFSET_SCALE;

		ctx.beginPath();
		ctx.moveTo(this.position.x + points[0] - offsetX, this.position.y + points[1] - offsetY);

		for (let b = 0; b < points.length; b += 2) ctx.lineTo(this.position.x + points[b] - offsetX, this.position.y + points[b + 1] - offsetY);

		ctx.fill();
	}
}

export default PineTree;
