class LoadProgressController {
	constructor () {
		this.totalSteps = 2;
	}

	log (currentProgress, processStep) {
		const progress = currentProgress * processStep * 100 / this.totalSteps;
		window['insect_realms_doms'].loadingProgressbar.style.width = progress + '%';

		console.log(progress);
	}

	loadResource (current, length) {
		this.log(current / length, 1);
	}

	generateMapStart () {
		window['insect_realms_doms'].loadingStateTitle.textContent = 'Generating Map...';

		console.log('Generating map');
		this.log(1, 1);
	}

	generateMapEnd () {
		console.log('Map generated');
		this.log(1, 2);
	}
}

window['load-progress-controller'] = new LoadProgressController();
