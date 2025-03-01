import AntColony from "./worldobject/env/ants/colony/AntColony.js";
import GrassGenerator from "./worldobject/env/GrassGenerator.js";
import PineTree from "./worldobject/env/PineTree.js";

class MapLoader {
	static GENERATE_QUALITY_LOW = 0;
	static GENERATE_QUALITY_NORMAL = 1;
	static GENERATE_QUALITY_HIGH = 2;

	static #generateObject (object, generateQuality) {
		if (object.type == 'pine-tree') return new PineTree(object, generateQuality);
		if (object.type == 'ant-colony') return new AntColony(object);
	}

	static #generateGrasses (count, width, height, variationsCount) {
		const grasses = [];
		const variations = [];

		for (let a = 0; a < variationsCount; a++) {
			variations.push(new GrassGenerator().generateImage());
		}

		for (let a = 0; a < count; a++) {
			const img = variations[a % variationsCount];
			const x = (Math.random() - 0.5) * width;
			const y = (Math.random() - 0.5) * height;
			const w = Math.random() * 100 + 50;
			const h = w;

			grasses.push({ img, x, y, w, h });
		}

		return grasses;
	}

	static async load (world, map, generateQuality = MapLoader.GENERATE_QUALITY_LOW) {
		console.log(map);
		world.worldWidth = map.width;
		world.worldHeight = map.height;
		const objects = map.objects;

		return new Promise(async (res) => {
			const length = objects.length;

			for (let a = 0; a < length; a++) {
				world.objects.push(MapLoader.#generateObject(objects[a], generateQuality));
				window['load-progress-controller'].generateMapProgress(a + 1, length);
				// await new Promise(resolve => setTimeout(resolve, 0));
			}

			world.grasses = MapLoader.#generateGrasses(5000, map.width, map.height, 20);

			res();
		});
	}
}

export default MapLoader;
