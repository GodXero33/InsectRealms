import Creature from "./Creature.js";
import SpiderControls from "./creaturecontrols/SpiderControls.js";

class Spider extends Creature {
	constructor (x, y, width, height, spriteMap) {
		super(x, y, width, height);

		this.spriteMap = spriteMap;
		this.currentAnimation = 'stop';
		this.frameSkipCounter = 0;
		this.frameSkipInterval = 1;
		this.animationPaused = false;
		this.speed = 1;
		this.turnSpeed = 0.02;
		this.controls = new SpiderControls(this);

		this.updateAnimationStatus();
	}

	updateAnimationStatus () {
		if (this.currentAnimation == 'stop') {
			this.currentStartFrameX = 0;
			this.currentMaxFrameX = 1;
			this.frameX = 0;
			this.frameY = 0;
			return;
		}

		this.currentStartFrameX = this.spriteMap.map.animations[this.currentAnimation].frameX - 1;
		this.currentMaxFrameX = this.spriteMap.map.animations[this.currentAnimation].frames;
		this.frameX = this.currentStartFrameX;
		this.frameY = this.spriteMap.map.animations[this.currentAnimation].frameY - 1;
	}

	setAction (action) {
		this.animationPaused = action == 'stop';
		this.currentAnimation = action;
		this.updateAnimationStatus();
	}

	draw (ctx) {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		
		const frameWidth = this.spriteMap.map.frameWidth;
		const frameHeight = this.spriteMap.map.frameHeight;

		ctx.drawImage(this.spriteMap.img, this.frameX * frameWidth, this.frameY * frameHeight, frameWidth, frameHeight, -this.width * 0.5, -this.height * 0.5, this.width, this.height);
		ctx.restore();
	}

	nextFrame () {
		if (this.frameX < this.currentStartFrameX + this.currentMaxFrameX - 1) {
			this.frameX++;
		} else {
			if (this.currentAnimation != 'dead') this.frameX = this.currentStartFrameX;
		}
	}

	updateFrame () {
		if (this.animationPaused) return;

		if (this.frameSkipCounter == this.frameSkipInterval) {
			this.frameSkipCounter = 0;
			this.nextFrame();
		} else {
			this.frameSkipCounter++;
		}
	}

	updateDebug (dt) {
		this.controls.update(this);
	}

	update (dt) {
		this.updateFrame();
		this.controls.update(this);
	}
}

export default Spider;
