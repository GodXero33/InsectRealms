import PineTree from "./worldobject/env/PineTree.js";

class MapLoader {
	static GENERATE_QUALITY_LOW = 0;
	static GENERATE_QUALITY_NORMAL = 1;
	static GENERATE_QUALITY_HIGH = 2;

	static #generateObject (object, generateQuality) {
		if (object.type == 'pine-tree') return new PineTree(object, generateQuality);
	}

	static async load (world, data, generateQuality = MapLoader.GENERATE_QUALITY_LOW) {
		return new Promise(async (res) => {
			const length = data.length;

			for (let a = 0; a < length; a++) {
				world.objects.push(MapLoader.#generateObject(data[a], generateQuality));
				window['load-progress-controller'].generateMapProgress(a + 1, length);
				await new Promise(resolve => setTimeout(resolve, 0));
			}

			res();
		});
	}
}

export default MapLoader;
