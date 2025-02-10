class Variant {
	constructor ({ start = -1, end = 1, step = 1, color = '#ffffff', type = 'xy' } = {}) {
		this.start = start;
		this.end = end;
		this.step = step;
		this.color = color;
		this.dataset = [];
		this.callback = null;
		this.type = type; // xy, xyt
	}

	generateData () {
		if (typeof this.callback != 'function') return null;

		this.dataset = [];

		if (this.type == 'xy') {
			for (let x = this.start; x <= this.end; x += this.step)
				this.dataset.push([x, this.callback(x)]);
		} else if (this.type == 'xyt') {
			for (let t = this.start; t <= this.end; t += this.step)
				this.dataset.push(this.callback(t));
		}

		return this.dataset;
	}
}

class Spiral extends Variant {
	constructor (settings = {}, r = 0, shape = 0.1, offset = 0.2) {
		super(settings);

		this.r = r;
		this.shape = shape;
		this.offset = offset;

		// this.callback = (x) => {
		// 	return Math.sin(x * 0.1) * 20;
		// }

		let rad = this.r - this.shape;

		this.callback = (t) => {
			rad += this.shape;
			return [Math.cos(t * this.offset) * rad, Math.sin(t * this.offset) * rad];
		}
	}
}
