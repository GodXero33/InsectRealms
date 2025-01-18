import PineTree from "./worldobject/env/PineTree.js";

class MapLoader {
	static GENERATE_QUALITY_LOW = 0;
	static GENERATE_QUALITY_NORMAL = 1;
	static GENERATE_QUALITY_HIGH = 2;

	static #generateObject (object, generateQuality) {
		if (object.type == 'pine-tree') return new PineTree(object, generateQuality);
	}

	static load (map, data, generateQuality = MapLoader.GENERATE_QUALITY_LOW) {
		data.forEach(object => map.objects.push(MapLoader.#generateObject(object, generateQuality)));
	}
}

export default MapLoader;
