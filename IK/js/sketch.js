class Point {
	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Segment {
	constructor (length = 10, angle = 0) {
		this.parent = null;
		this.child = [];
		this.a = new Point();
		this.b = new Point();
		this.length = length;
		this.angle = angle;
		this.anglePrev = this.angle;
		this.maxAngle = Math.PI;
		this.minAngle = -Math.PI;

		this.calc();
	}

	calc () {
		this.b.x = this.a.x + this.length * Math.cos(this.angle);
		this.b.y = this.a.y + this.length * Math.sin(this.angle);
	}

	constrainAngle () {
		const referenceAngle = this.parent ? this.parent.angle : 0;
		const relativeAngle = this.angle - referenceAngle;
		const clampedRelativeAngle = Math.max(this.minAngle, Math.min(this.maxAngle, relativeAngle));

		this.angle = ((referenceAngle + clampedRelativeAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
	}

	follow (x, y, level = 1) {
		const dirX = x - this.a.x;
		const dirY = y - this.a.y;
		const dis = Math.sqrt(dirX * dirX + dirY * dirY);

		this.angle = Math.atan2(dirY, dirX);
		this.a.x = x - (dirX / dis) * this.length;
		this.a.y = y - (dirY / dis) * this.length;

		this.constrainAngle();

		if (level - 1 > 0 && this.parent) this.parent.follow(this.a.x, this.a.y, level - 1);
	}

	update () {
		if (this.parent) {
			const parentAngle = this.parent.angle;
			this.angle += parentAngle - this.parent.anglePrev;

			const relativeAngle = this.angle - parentAngle;
			this.angle = parentAngle + Math.max(this.minAngle, Math.min(this.maxAngle, relativeAngle));

			this.a.x = this.parent.b.x;
			this.a.y = this.parent.b.y;
		}

		this.angle %= (Math.PI * 2);

		this.calc();
		this.child.forEach(child => child.update());

		this.anglePrev = this.angle;
	}

	draw (ctx) {
		ctx.strokeStyle = '#fffffff';
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y);
		ctx.lineTo(this.a.x, this.a.y);
		ctx.moveTo(this.b.x, this.b.y);
		ctx.lineTo(this.b.x, this.b.y);
		ctx.stroke();

		ctx.lineWidth = 2;
		ctx.lineCap = 'butt';
		ctx.beginPath();
		ctx.moveTo(this.a.x, this.a.y);
		ctx.lineTo(this.b.x, this.b.y);
		ctx.stroke();
	}
}

(function () {
	let canvas, ctx;
	let playing = false;
	let prevTime = 0;
	let fps = 0;
	let width = 0;
	let height = 0;
	let tentacle = null;
	let last = null;
	let mouse = new Point();

	function drawFPS () {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = '#ffffff';
		ctx.font = '20px Arial';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText(Math.floor(fps), 30, 20);
	}

	function draw () {
		drawFPS();

		const transform = ctx.getTransform();

		ctx.translate(width * 0.5, height * 0.5);

		let queue = [tentacle];

		while (queue.length != 0) {
			const current = queue.shift();
			current.draw(ctx);
			current.child.forEach(child => queue.push(child));
		}

		ctx.setTransform(transform);
	}

	function update (dt) {
		// tentacle.angle += 0.01;
		last.follow(mouse.x, mouse.y, 4);
		tentacle.update();
	}

	function resize () {
		width = canvas.parentElement.clientWidth;
		height = canvas.parentElement.clientHeight;
		canvas.width = width;
		canvas.height = height;

		//
		draw();
	}

	function animate () {
		if (!playing) return;

		let now = window.performance.now();
		let dt = now - prevTime;
		dt = Math.max(dt, 2);
		fps = 1000 / dt;

		draw();
		update(dt);

		prevTime = now;

		window.requestAnimationFrame(animate);
	}

	function play () {
		playing = true;
		prevTime = window.performance.now();
		animate();
	}

	function pause () {
		playing = false;
	}

	function init () {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');

		tentacle = new Segment(10);

		const legs = 4;

		for (let a = 0; a < legs; a++) {
			let current = tentacle;

			for (let i = 0; i < 4; i++) {
				const segment = new Segment(80 - a * 5 - i * 20, -(i + 1) * 0.2 - (a + 1) * 0.5);
				segment.parent = current;
				current.child.push(segment);
				current = segment;
			}
		}

		for (let a = 0; a < legs; a++) {
			let current = tentacle;

			for (let i = 0; i < 4; i++) {
				const segment = new Segment(80 - a * 5 - i * 20, (i + 1) * 0.2 + (a + 1) * 0.5);
				segment.parent = current;
				
				/* if (i == 0) {
					segment.maxAngle = (i + 1) * 0.2 + (a + 1) * 0.5 + 0.2;
					segment.minAngle = Math.PI / 6;
				} else {
					segment.maxAngle = Math.PI / 3;
					segment.minAngle = 0;
				} */

				current.child.push(segment);
				current = segment;
	
				if (i == 3 && a == 0) last = segment;
			}
		}

		// last.minAngle = 0;
		// last.maxAngle = Math.PI / 6;

		tentacle.update();
		console.log(tentacle);

		window.addEventListener('resize', resize);
		window.addEventListener('keydown', (event) => {
			if (event.code == 'Space') (playing ? pause : play)();
		});
		window.addEventListener('mousemove', (event) => {
			mouse.x = event.x - width * 0.5;
			mouse.y = event.y - height * 0.5;
		});

		resize();
		play();
	}

	window.addEventListener('DOMContentLoaded', init);
})();
