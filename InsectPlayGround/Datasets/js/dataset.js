class Graph {
	constructor (...variant) {
		this.variants = variant.filter(v => v instanceof Variant);
		
		this.variants.forEach(variant => variant.generateData());
	}

	#drawVariant (ctx, variant) {
		ctx.fillStyle = variant.color;
		const size = Math.max(2, variant.step * 0.5);

		variant.dataset.forEach(data => ctx.fillRect(data[0] - size * 0.5, -data[1] + size * 0.5, size, size));
	}

	draw (ctx) {
		this.variants.forEach(variant => this.#drawVariant(ctx, variant));
	}
}
