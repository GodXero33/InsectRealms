class MiniMap {
	constructor (world) {
		this.world = world;
		this.asp = this.world.worldWidth / this.world.worldHeight;
		this.canvas = null;
		this.ctx = null;
		this.mapImage = null;
		this.width = 1;
		this.height = 1;

		this.#createDOM();
	}

	#createDOM () {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.style = 'position: absolute; width: clamp(200px, 20%, 350px); aspect-ratio: ' + this.world.worldWidth + ' / ' + this.world.worldHeight + '; bottom: 10px; right: 10px; z-index: 200; filter: drop-shadow(0 0 5px #000000); border: 2px solid #aaaaaa;';

		this.resize();
		window['insect_realms_doms'].mainContainer.appendChild(this.canvas);
	}

	generateStaticImage () {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const width = 1024;
		const height = this.asp * 1024;

		canvas.width = width;
		canvas.height = height;

		ctx.fillStyle = '#000000';

		ctx.fillRect(0, 0, width, height);

		const objOffsetX = width * 0.5;
		const objOffsetY = height * 0.5;
		const objPosScale = width / this.world.worldWidth;

		this.world.objects.forEach(object => {
			ctx.fillStyle = object.miniMapColor;

			ctx.fillRect(objOffsetX + object.position.x * objPosScale, objOffsetY + object.position.y * objPosScale, object.width * objPosScale, object.height * objPosScale)
		});

		const img = new Image();

		img.src = canvas.toDataURL();
		this.mapImage = img;
	}

	resize () {
		this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
		this.canvas.width  =this.width;
		this.canvas.height = this.height;
	}

	draw (screenWidth, screenHeight) {
		const width = this.width;
		const height = this.height;
		const ctx = this.ctx;
		const maxDimension = Math.max(screenWidth, screenHeight);
		const mapWidth = Math.min(0.2 * maxDimension, 250);
		const mapHeight = mapWidth / this.asp;
		const borderSize = maxDimension * 0.002;
		const x = width - mapWidth - borderSize - 10;
		const y = height - mapHeight - borderSize - 10;

		ctx.clearRect(0, 0, width, height);

		const objOffsetX = mapWidth * 0.5;
		const objOffsetY = mapHeight * 0.5;
		const objPosScale = mapWidth / this.world.worldWidth;

		ctx.drawImage(this.mapImage, 0, 0, width, height);

		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = objPosScale * 100;

		ctx.strokeRect(objOffsetX + this.world.camera.position.x * objPosScale - screenWidth * objPosScale * 0.5 / this.world.camera.scale, objOffsetY + this.world.camera.position.y * objPosScale - screenHeight * objPosScale * 0.5 / this.world.camera.scale, screenWidth * objPosScale / this.world.camera.scale, screenHeight * objPosScale / this.world.camera.scale);

		ctx.restore();
	}
}

export default MiniMap;
