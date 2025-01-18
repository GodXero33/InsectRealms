import InsectWorld from './world/InsectWorld.js';

(function (exports) {
	let canvas, ctx, insectWorld, worldResources, gui;
	let playing = false;
	let prevTime = 0;
	let fps = 0;
	let width = 0;
	let height = 0;
	let isFirstCall = true;

	function drawFPS () {
		ctx.fillStyle = '#ffffff';
		ctx.font = '20px Arial';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText(Math.floor(fps), 30, 20);
	}

	function draw () {
		ctx.fillStyle = '#787812';

		ctx.fillRect(0, 0, width, height);
		insectWorld.render(ctx, width, height);
		drawFPS();
	}

	function update (dt) {
		insectWorld.update(dt);
	}

	function resize () {
		width = canvas.parentElement.clientWidth;
		height = canvas.parentElement.clientHeight;
		canvas.width = width;
		canvas.height = height;

		insectWorld.resize(width, height);
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

	function createGUI () {
		gui = new dat.GUI();

		const worldSettingsFolder = gui.addFolder('World Settings');
		const cameraFolder = worldSettingsFolder.addFolder('Camera');

		worldSettingsFolder.add(insectWorld, 'debugMode');
		cameraFolder.add(insectWorld.camera, 'scale', 1, 5);
		cameraFolder.add(insectWorld.camera, 'panningSpeed', 1, 10);
		cameraFolder.add(insectWorld.camera, 'zoomingFact', 0.01, 0.5);

		const actions = {
			resetWorld: function () {
				init(worldResources);
			}
		};

		gui.add(actions, 'resetWorld').name('Reset World');

		worldSettingsFolder.open();
		cameraFolder.open();
	}

	function init (resources) {
		worldResources = resources;
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		insectWorld = new InsectWorld(worldResources.resources, worldResources.maps['M0001'].objects);

		if (!isFirstCall) return;

		isFirstCall = false;
		
		console.log(insectWorld);
		createGUI();
		window.addEventListener('resize', resize);
		window.addEventListener('keydown', (event) => {
			if (event.code == 'Space') (playing ? pause : play)();
			if (event.code == 'KeyL') insectWorld.debugMode = !insectWorld.debugMode;
		})

		resize();
		play();
	}

	exports.init = init;

	window['INSECT_REALM'] = exports;
})({});
