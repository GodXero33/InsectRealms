const ctx = canvas.getContext('2d');
let playing = false;
let nextFrame = null;
let width = 0;
let height = 0;
const world = new World();

function draw () {
	const transform = ctx.getTransform();

	ctx.clearRect(0, 0, width, height);
	ctx.translate(width * 0.5, height * 0.5);
	world.draw(ctx);
	ctx.setTransform(transform);
}

function update () {
	world.update();
}

function animate () {
	draw();
	update();
	nextFrame = window.requestAnimationFrame(animate);
}

function play () {
	playing = true;
	animate();
}

function pause () {
	playing = false;
	window.cancelAnimationFrame(nextFrame);
}

function resize () {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	draw();
}

play();
resize();

window.addEventListener('keydown', (event) => {
	if (event.code == 'KeyW') world.insect.controls.up = true;
	if (event.code == 'KeyS') world.insect.controls.down = true;
	if (event.code == 'KeyD') world.insect.controls.right = true;
	if (event.code == 'KeyA') world.insect.controls.left = true;
});

window.addEventListener('keyup', (event) => {
	if (event.code == 'Space') playing ? pause() : play();
	if (event.code == 'KeyW') world.insect.controls.up = false;
	if (event.code == 'KeyS') world.insect.controls.down = false;
	if (event.code == 'KeyD') world.insect.controls.right = false;
	if (event.code == 'KeyA') world.insect.controls.left = false;
});

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (event) => {
	world.mouse.x = event.x - width * 0.5;
	world.mouse.y = event.y - height * 0.5;
});
