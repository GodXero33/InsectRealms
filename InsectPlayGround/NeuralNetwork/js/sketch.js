const network = new NeuralNetwork(9, [18, 18, 18, 18], 9);
let trainingState = 100;

async function networkSetup (dataset) {
	console.log(dataset);
	let time = performance.now();
	console.log("Training started:");
	const iters = 10000;

	for (let a = 0; a < iters; a++) {
		dataset.forEach(data => {
			const target = new Array(9).fill(0);
			target[data[1]] = 1;

			network.train(data[0].map(v => v / 2), target);
		});

		trainingState = a * 100 / iters;
		draw();
		await new Promise(res => setTimeout(res, 0));
	}
	
	for (let a = 0; a < dataset.length; a++) {
		const guess =  network.guess(dataset[a][0]);
		console.log("guess: " + guess.indexOf(Math.max(...guess)));
		console.log("actual: " + dataset[a][1]);
	}
	
	console.log("Training ended in " + (performance.now() - time) + " ms.");
	console.log(network);
}

async function loadData () {
	try {
		const response = await fetch('../TicTacToe-ForMakeDatasetToNeuralNetwork/js/data.json');

		if (!response.ok) throw new Error('Failed to fetch!');

		const data = await response.json();

		networkSetup(data);
	} catch (error) {
		console.error(error);
	}
}

loadData();



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

	ctx.fillStyle = '#ffffff';
	ctx.font = '30px Arial';
	ctx.textBaseline = 'middle';

	ctx.fillText(trainingState + '%', 210, 30);
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
