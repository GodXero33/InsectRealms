import CameraMouseControl from './world/camera/CameraMouseControl.js';
import CameraKeyControl from './world/camera/CameraKeyControl.js';
import InsectWorld from './world/InsectWorld.js';
import MiniMap from './world/MiniMap.js';
import CameraTouchControl from './world/camera/CameraTouchControl.js';
import PineTree from './world/worldobject/env/PineTree.js';

(function (exports) {
	let canvas, ctx, insectWorld, miniMap, worldResources, gui, statsDisplay;
	let playing = false;
	let prevTime = 0;
	let width = 0;
	let height = 0;
	
	const simulationData = { visibleObjects: 0 };

	function draw () {
		ctx.fillStyle = '#787812';

		ctx.fillRect(0, 0, width, height);
		insectWorld.render(ctx, width, height);
		miniMap.draw(ctx, width, height);
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

		statsDisplay.begin();
		draw();
		update(dt);
		statsDisplay.end();

		simulationData.visibleObjects = insectWorld.drawableObjects.length;
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

		const fpsFolder = gui.addFolder('Simulation Data');
		fpsFolder.add(simulationData, 'visibleObjects').name('Visible Objects').listen();
		fpsFolder.open();

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

	function createStatsDisplay () {
		statsDisplay = new Stats();

		statsDisplay.showPanel(0);
		document.body.appendChild(statsDisplay.dom);
	}

	function init (resources) {
		worldResources = resources;
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		insectWorld = new InsectWorld(worldResources.resources, worldResources.maps['M0001'].objects);
		miniMap = new MiniMap(insectWorld);

		new CameraKeyControl(insectWorld.camera);
		new CameraMouseControl(insectWorld.camera, canvas);
		new CameraTouchControl(insectWorld.camera, 0.2, canvas);
		
		console.log(insectWorld, PineTree.generated, PineTree.instances.length);
		createGUI();
		createStatsDisplay();
		window.addEventListener('resize', resize);
		window.addEventListener('keydown', (event) => {
			if (event.code == 'Space') (playing ? pause : play)();
			if (event.code == 'KeyL') insectWorld.debugMode = !insectWorld.debugMode;
		});

		resize();
		play();
	}

	exports.init = init;

	window['INSECT_REALM'] = exports;
})({});
