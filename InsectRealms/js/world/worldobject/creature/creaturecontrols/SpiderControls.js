class SpiderControls {
	constructor (spider) {
		this.spider = spider;
		this.moveForward = false;
		this.moveBackward = false;
		this.turnLeft = false;
		this.turnRight = false;

		window.addEventListener('click', () => {
			if (this.moveForward && !this.turnRight) {
				this.setMoveStop();
				this.setTurnLeft();
			} else if (!this.moveForward) {
				this.setMoveForward();
				this.setTurnRight();
			} else {
				this.setTurnStop();
				this.setMoveStop();
			}
		});
	}

	setMoveForward () {
		this.moveForward = true;
		this.moveBackward = false;
		this.spider.setAction('walk');
	}

	setMoveBackward () {
		this.moveForward = false;
		this.moveBackward = true;
		this.spider.setAction('walk');
	}

	setMoveStop () {
		this.moveForward = false;
		this.moveBackward = false;
		
		if (this.turnLeft || this.turnRight) {
			this.spider.setAction('walk');
		} else {
			this.spider.setAction('stop');
		}
	}

	setTurnLeft () {
		this.turnLeft = true;
		this.turnRight = false;
		this.spider.setAction('walk');
	}

	setTurnRight () {
		this.turnLeft = false;
		this.turnRight = true;
		this.spider.setAction('walk');
	}

	setTurnStop () {
		this.turnLeft = false;
		this.turnRight = false;

		if (this.moveForward || this.moveBackward) {
			this.spider.setAction('walk');
		} else {
			this.spider.setAction('stop');
		}
	}

	updateSpiderMovement () {
		if (this.moveForward || this.moveBackward) {
			const direction = this.moveForward ? 1 : -1;
			const speed = this.spider.speed * direction;

			this.spider.position.x += Math.cos(this.spider.rotation) * speed;
			this.spider.position.y += Math.sin(this.spider.rotation) * speed;
		}

		if (this.turnLeft) this.spider.rotation += this.spider.turnSpeed;
		if (this.turnRight) this.spider.rotation -= this.spider.turnSpeed;
	}

	update () {
		this.updateSpiderMovement();
	}
}

export default SpiderControls;
