const graph = new Graph(
	new Spiral({ start: 0, end: Math.PI * 10, step: 0.05, type: 'xyt', color: '#f00' }),
	new Spiral({ start: 0, end: Math.PI * 10, step: 0.05, type: 'xyt', color: '#0ff' }, 0, 0.1, 0.25),
	new Spiral({ start: 0, end: Math.PI * 10, step: 0.05, type: 'xyt', color: '#0f0' }, 0, 0.1, 0.1)
);
console.log(graph);

const ctx = canvas.getContext('2d');
let isPlaying = false;
let animationFrame = null;
let width = 0;
let height = 0;

function draw () {
	const transform = ctx.getTransform();

	ctx.clearRect(0, 0, width, height);
	ctx.translate(width * 0.5, height * 0.5);
	graph.draw(ctx, 0, 0, width, height);
	ctx.setTransform(transform);
}

function update () {}

function animate () {
	draw();
	update();
	animationFrame = window.requestAnimationFrame(animate);
}

function play () {
	isPlaying = true;
	animate();
}

function pause () {
	isPlaying = false;
	window.cancelAnimationFrame(animationFrame);
}

function resize () {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	ctx.imageSmoothingEnabled = true;

	draw();
}

resize();
play();

window.addEventListener('keyup', event => {
	if (event.code == 'Space') isPlaying ? pause() : play();
});

window.addEventListener('resize', resize);
