import PineTree from "./worldobject/env/PineTree.js";

class MapLoader {
	static #generateObject (object) {
		if (object.type == 'pine-tree') return new PineTree(object);
	}

	static load (map, data) {
		data.forEach(object => {
			map.objects.push(MapLoader.#generateObject(object));
		});
	}
}

export default MapLoader;
