class NeuralNetworkDrawer {
	constructor (network) {
		this.network = network;
	}

	draw (ctx, x, y, w, h) {
		const layersCount = this.network.hiddenLayers.length + 1 + 1;
		const size = 20;
		const gap = 10;
		const inputHeight = this.network.inputLength * (size + gap) - gap;
		const outputHeight = this.network.outputLayer.length * (size + gap) - gap;
		const inputX = x + size;
		const outputX = x + w - size;
		const inputY = y + (h - inputHeight) * 0.5;
		const outputY = y + (h - outputHeight) * 0.5;
		const dy = size + gap;
		const dx = (w - size * 2) / (layersCount - 1);

		ctx.fillStyle = '#ff0000';
		ctx.globalAlpha = 1;

		// draw input nodes
		for (let a = 0; a < this.network.inputLength; a++) ctx.fillRect(inputX - size * 0.5, inputY + dy * a - size * 0.5, size, size);

		// draw hidden nodes
		for (let a = 0; a < layersCount - 2; a++) {
			const layerHeight = this.network.hiddenLayers[a].length * (size + gap) - gap;
			const layerX = inputX + (a + 1) * dx;
			const layerY = y + (h - layerHeight) * 0.5;

			for (let b = 0; b < this.network.hiddenLayers[a].length; b++) {
				ctx.globalAlpha = this.network.hiddenLayers[a].biases[b];
				ctx.fillRect(layerX - size * 0.5, layerY + dy * b - size * 0.5, size, size);
			}
		}

		// draw output nodes
		for (let a = 0; a < this.network.outputLayer.length; a++) {
			ctx.globalAlpha = this.network.outputLayer.biases[a];
			ctx.fillRect(outputX - size * 0.5, outputY + dy * a - size * 0.5, size, size);
		}


		// draw connections
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 1;

		// draw input-first hidden connection
		for (let a = 0; a < this.network.inputLength; a++) {
			for (let b = 0; b < this.network.hiddenLayers[0].length; b++) {
				const layerHeight = this.network.hiddenLayers[0].length * (size + gap) - gap;
				const layerX = inputX + dx;
				const layerY = y + (h - layerHeight) * 0.5;
				
				ctx.globalAlpha = this.network.hiddenLayers[0].weights[a][b];

				ctx.beginPath();
				ctx.moveTo(inputX, inputY + dy * a);
				ctx.lineTo(layerX, layerY + dy * b);
				ctx.stroke();
			}
		}

		// draw hidden layer-hidden layer connection
		for (let c = 0; c < layersCount - 3; c++) {
			for (let a = 0; a < this.network.hiddenLayers[c].length; a++) {
				const layer1Height = this.network.hiddenLayers[c].length * (size + gap) - gap;
				const layer1X = inputX + (c + 1) * dx;
				const layer1Y = y + (h - layer1Height) * 0.5 + dy * a;

				for (let b = 0; b < this.network.hiddenLayers[c + 1].length; b++) {
					const layer2Height = this.network.hiddenLayers[c + 1].length * (size + gap) - gap;
					const layer2X = inputX + (c + 2) * dx;
					const layer2Y = y + (h - layer2Height) * 0.5 + dy * b;

					ctx.globalAlpha = this.network.hiddenLayers[c + 1].weights[a][b];

					ctx.beginPath();
					ctx.moveTo(layer1X, layer1Y);
					ctx.lineTo(layer2X, layer2Y);
					ctx.stroke();
				}
			}
		}

		// draw last hidden layer-output layer connection
		for (let a = 0; a < this.network.hiddenLayers[this.network.hiddenLayers.length - 1].length; a++) {
			for (let b = 0; b < this.network.outputLayer.length; b++) {
				const layer1Height = this.network.hiddenLayers[this.network.hiddenLayers.length - 1].length * (size + gap) - gap;
				const layer2Height = this.network.outputLayer.length * (size + gap) - gap;
				const layerX = inputX + (this.network.hiddenLayers.length - 1 + 1) * dx;
				const layer1Y = y + (h - layer1Height) * 0.5;
				const layer2Y = y + (h - layer2Height) * 0.5;
				
				ctx.globalAlpha = this.network.hiddenLayers[this.network.hiddenLayers.length - 1].weights[a][b];

				ctx.beginPath();
				ctx.moveTo(layerX, layer1Y + dy * a);
				ctx.lineTo(layerX + dx, layer2Y + dy * b);
				ctx.stroke();
			}
		}

		ctx.stroke();

		ctx.globalAlpha = 1;
	}
}

class NeuralLayer {
	constructor (length, prevLength) {
		this.length = length;
		this.prevLength = prevLength;
		this.weights = Array.from({ length: prevLength }, () => Array.from({ length }, () => Math.random()));
		this.biases = Array.from({ length }, () => Math.random());
	}
}

class NeuralNetwork {
	constructor (inputLength, hiddenLayers, outputLength) {
		this.inputLength = inputLength;
		this.hiddenLayers = hiddenLayers.map((length, index) => new NeuralLayer(length, index == 0 ? this.inputLength : hiddenLayers[index - 1]));
		this.outputLayer = new NeuralLayer(outputLength, hiddenLayers[hiddenLayers.length - 1]);
		this.learningRate = 0.05;
	}

	activation (x) {
		return Math.tanh(x);
	}

	feedForward (input) {
		let output = new Array(output.length).fill(0);

		for (let a = 0; a < firstHiddenLayer.length; a++) {
			output[a] = 0;

			for (let b = 0; b < this.inputLength; b++) output[a] += this.hiddenLayers[0].weights[b][a] * input[b];

			output[a] = this.activation(output[a] + this.hiddenLayers[0].bias[a]);
		}
	}

	train (input, target) {}
}
