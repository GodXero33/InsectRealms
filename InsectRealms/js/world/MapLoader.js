import AntColony from "./worldobject/env/ants/colony/AntColony.js";
import PineTree from "./worldobject/env/PineTree.js";

class MapLoader {
	static GENERATE_QUALITY_LOW = 0;
	static GENERATE_QUALITY_NORMAL = 1;
	static GENERATE_QUALITY_HIGH = 2;

	static #generateObject (object, generateQuality) {
		if (object.type == 'pine-tree') return new PineTree(object, generateQuality);
		if (object.type == 'ant-colony') return new AntColony(object);
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

			res();
		});
	}
}

export default MapLoader;
