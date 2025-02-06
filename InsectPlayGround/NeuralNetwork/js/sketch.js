const network = new NeuralNetwork(2, [10, 10], 2);

const dataset = [
	[
		[0, 0],
		[1, 1]
	],
	[
		[1, 0],
		[0, 1]
	],
	[
		[0, 1],
		[1, 0]
	],
	[
		[1, 1],
		[0, 0]
	]
];

for (let a = 0; a < 100000; a++) {
	dataset.forEach(data => {
		network.train(data[0], data[1]);
	});
}

for (let a = 0; a < 4; a++) {
	console.log(network.guess(dataset[a][0]).map(v => Math.round(v)));
	console.log(dataset[a][1]);
}

console.log(network);

const networkDrawer = new NeuralNetworkDrawer(network);
const ctx = canvas.getContext('2d');
let isPlaying = false;
let animationFrame = null;
let width = 0;
let height = 0;

function draw () {
	const transform = ctx.getTransform();

	ctx.clearRect(0, 0, width, height);
	ctx.translate(width * 0.5, height * 0.5);
	networkDrawer.draw(ctx, -width * 0.5, -height * 0.5, width, height);
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
