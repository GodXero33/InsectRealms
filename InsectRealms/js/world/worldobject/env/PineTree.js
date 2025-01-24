import { map } from "../../../extra/Math.js";
import MapLoader from "../../MapLoader.js";
import WorldObject from "../../WorldObject.js";

class PineTree extends WorldObject {
	static LAYERS = 8;
	static OFFSET_SCALE = 300;
	static NOISE_OFFSET = 10;
	static instances = [];
	static generated = 0;

	constructor (data, generateQuality) {
		super(data.x, data.y, data.rotation, data.size, data.size);

		this.layerTextures = [];
		this.shadowTexture = null;
		this.miniMapColor = '#00ff00';
		this.isLayered = true;
		this.castShadow = true;

		const sameSizeTree = PineTree.instances.find(tree => tree.width == this.width);

		if (sameSizeTree) {
			this.layerTextures = sameSizeTree.layerTextures;
			this.shadowTexture = sameSizeTree.shadowTexture;
		} else {
			this.#generateLayersTextures(generateQuality == MapLoader.GENERATE_QUALITY_HIGH ? 60 : generateQuality == MapLoader.GENERATE_QUALITY_NORMAL ? 40 : 20, 5);
		}

		PineTree.instances.push(this);
	}

	#generateLayersTextures (noisy, textureQualityMultiplier) {
		const texture = document.createElement('canvas');
		const ctx = texture.getContext('2d');
		let width = this.width * textureQualityMultiplier;
		const size = width / 2;
		const deltaAngle = Math.PI * 2 / noisy;
		const noiseOffset = PineTree.NOISE_OFFSET * textureQualityMultiplier;
		const drawOutlines = true;

		texture.width = width;
		texture.height = width;

		const newTexture = () => {
			const url = texture.toDataURL();
			const img = new Image();

			img.src = url;

			return img;
		}

		if (drawOutlines) {
			ctx.strokeStyle = '#00000066';
			ctx.lineWidth = 2 * textureQualityMultiplier;
		}

		for (let a = 0; a < PineTree.LAYERS; a++) {
			const scale = (PineTree.LAYERS - a) * 0.9 / PineTree.LAYERS;
			ctx.fillStyle = `#00${Math.floor(map(a, 0, PineTree.LAYERS, 50, 255)).toString(16).padStart(2, 0)}00`;

			ctx.clearRect(0, 0, width, width);
			ctx.beginPath();

			for (let b = 0; b < noisy; b++) {
				const x = Math.cos(deltaAngle * b) * scale * size - Math.random() * noiseOffset + width * 0.5;
				const y = Math.sin(deltaAngle * b) * scale * size - Math.random() * noiseOffset + width * 0.5;

				b == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
			}

			ctx.closePath();
			ctx.fill();

			if (drawOutlines) ctx.stroke();

			this.layerTextures.push(newTexture());
		}

		ctx.fillStyle = '#000000';
		
		ctx.clearRect(0, 0, width, width);
		ctx.beginPath();

		for (let b = 0; b < noisy; b++) {
			const x = Math.cos(deltaAngle * b) * size * 0.9 - Math.random() * noiseOffset + width * 0.5;
			const y = Math.sin(deltaAngle * b) * size * 0.9 - Math.random() * noiseOffset + width * 0.5;

			if (b == 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}

		ctx.closePath();
		ctx.fill();

		this.shadowTexture = newTexture();
		PineTree.generated++;
	}

	drawShadow (ctx, opacity) {
		ctx.globalAlpha = opacity;

		ctx.drawImage(this.shadowTexture, this.position.x - this.width * 0.5, this.position.y - this.width * 0.5, this.width, this.width);
		
		ctx.globalAlpha = 1;
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

		const layerDepthFactor = (layer + 1) / PineTree.LAYERS;
		const treeScreenX = this.position.x - cx;
		const treeScreenY = this.position.y - cy;
		const distanceToLeft = treeScreenX;
		const distanceToRight = extendedVw - treeScreenX;
		const distanceToTop = treeScreenY;
		const distanceToBottom = extendedVh - treeScreenY;
		const offsetX = layerDepthFactor * (distanceToLeft < distanceToRight ? -distanceToLeft / extendedVw : distanceToRight / extendedVw) * PineTree.OFFSET_SCALE;
		const offsetY = layerDepthFactor * (distanceToTop < distanceToBottom ? -distanceToTop / extendedVh : distanceToBottom / extendedVh) * PineTree.OFFSET_SCALE;

		ctx.drawImage(this.layerTextures[layer], this.position.x - this.width * 0.5 - offsetX, this.position.y - this.width * 0.5 - offsetY, this.width, this.width);
	}
}

export default PineTree;
