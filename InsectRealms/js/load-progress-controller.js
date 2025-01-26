class LoadProgressController {
	constructor () {
		this.totalSteps = 2;
	}

	log (currentProgress, processStep) {
		console.log(currentProgress * processStep * 100 / this.totalSteps);
	}

	loadResource (current, length) {
		this.log(current / length, 1);
	}

	generateMapStart () {
		console.log('Generating map');
		this.log(1, 1);
	}

	generatedMap () {
		console.log('Map generated');
		this.log(1, 2);
	}
}

window['load-progress-controller'] = new LoadProgressController();
