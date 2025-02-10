class NeuralLayer {
	constructor (prevLength, length) {
		this.prevLength = prevLength;
		this.length = length;
		this.biases = Array.from({ length }, () => Math.random() * 2 - 1);
		this.weights = Array.from({ length: prevLength }, () => Array.from({ length }, () => Math.random() * 2 - 1));
	}
}

class NeuralNetwork {
	constructor (inputLayers, hiddenLayers, outputLayer) {
		this.inputLength = inputLayers;
		this.hiddenLayers = hiddenLayers.map((layerLength, index) => new NeuralLayer(index == 0 ? inputLayers : hiddenLayers[index - 1], layerLength));
		this.outputLayer = new NeuralLayer(hiddenLayers[hiddenLayers.length - 1], outputLayer);
		this.learningRate = 0.1;
	}

	activation (x) {
		return Math.max(0, x);
	}

	softMax (inputs) {
		const max = Math.max(...inputs);
		const expValues = inputs.map(v => Math.exp(v - max));
		const sum = inputs.reduce((a, v) => a + v);
		const probabilities = expValues.map(v => v / sum);

		return probabilities;
	}
}
