class Vector {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add (vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	addScalar (scalar) {
		this.x += scalar;
		this.y += scalar;
		return this;
	}
	
	sub (vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	subScalar (scalar) {
		this.x -= scalar;
		this.y -= scalar;
		return this;
	}

	mult (vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	}

	multScalar (scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	div (vec) {
		if (vec.x != 0) this.x /= vec.x;
		if (vec.y != 0) this.y /= vec.y;
		return this;
	}

	divScalar (scalar) {
		if (scalar == 0) return this;
		
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	disSQRT (vec) {
		return (this.x - vec.x) ** 2 + (this.y - vec.y) ** 2;
	}

	dis (vec) {
		return Math.sqrt(this.disSQRT(vec));
	}

	lengthSQRT () {
		return this.x * this.x + this.y * this.y;
	}

	length () {
		return Math.sqrt(this.lengthSQRT());
	}

	normalize () {
		const len = this.length();

		if (len == 0) return this;

		this.x /= len;
		this.y /= len;
		return this;
	}

	setLength (length) {
		return this.normalize().multScalar(length);;
	}

	limit (max) {
		const lenSQ = this.lengthSQRT();

		if (lenSQ > max * max) this.normalize().multScalar(max);

		return this;
	}

	randomize () {
		this.x = Math.random() * 2 - 1;
		this.y = Math.random() * 2 - 1;
		
		return this.normalize();
	}

	clone () {
		return new Vector(this.x, this.y);
	}

	angle () {
		return Math.atan2(this.y, this.x);
	}
}

export default Vector;
