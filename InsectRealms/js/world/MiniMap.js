class MiniMap {
	constructor (world) {
		this.world = world;
		this.asp = this.world.worldWidth / this.world.worldHeight;
	}

	draw (ctx, width, height) {
		const maxDimension = Math.max(width, height);
		const mapWidth = Math.min(0.2 * maxDimension, 250);
		const mapHeight = mapWidth / this.asp;
		const borderSize = maxDimension * 0.002;
		const x = width - mapWidth - borderSize - 10;
		const y = height - mapHeight - borderSize - 10;

		ctx.save();

		ctx.strokeStyle = '#ffffff';
		ctx.shadowColor = '#000000';
		ctx.lineWidth = borderSize;
		ctx.shadowBlur = 10;

		ctx.strokeRect(x - borderSize * 0.5, y - borderSize * 0.5, mapWidth + borderSize, mapHeight + borderSize);

		ctx.shadowBlur = 0;
		ctx.fillStyle = '#000000';

		ctx.fillRect(x, y, mapWidth, mapHeight);

		const objOffsetX = x + mapWidth * 0.5;
		const objOffsetY = y + mapHeight * 0.5;
		const objPosScale = mapWidth / this.world.worldWidth;

		this.world.objects.forEach(object => {
			ctx.fillStyle = object.miniMapColor;

			ctx.fillRect(objOffsetX + object.position.x * objPosScale, objOffsetY + object.position.y * objPosScale, object.width * objPosScale, object.height * objPosScale)
		});

		ctx.lineWidth = objPosScale * 100;
		ctx.strokeRect(objOffsetX + this.world.camera.position.x * objPosScale - width * objPosScale * 0.5 / this.world.camera.scale, objOffsetY + this.world.camera.position.y * objPosScale - height * objPosScale * 0.5 / this.world.camera.scale, width * objPosScale / this.world.camera.scale, height * objPosScale / this.world.camera.scale);

		ctx.restore();
	}
}

export default MiniMap;
