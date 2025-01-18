(() => {
	let resourcesMap;
	const loadedResources = [];
	const failedResources = [];
	const loadedResourcesMap = {
		resources: {},
		maps: {}
	};

	function resourceLoadOk (URL, ok) {
		if (ok) {
			loadedResources.push(URL);
		} else {
			failedResources.push(URL);
		}
	}

	function loadSprite (URL, name) {
		return new Promise((res, rej) => {
			const img = new Image();
		
			img.src = URL;
			img.onload = () => {
				resourceLoadOk(URL, true);
				res({ ok: true, name, res: img });
			};
			img.onerror = () => {
				resourceLoadOk(URL, false);
				res({ ok: false, name });
			}
		});
	}

	function loadJSON (URL, name) {
		return new Promise(async (res, rej) => {
			try {
				const response = await fetch(URL);

				if (!response.ok) {
					resourceLoadOk(URL, false);
					res({ ok: false, error: 'failed to fetch: ' + URL, name });
					return;
				}

				const json = await response.json();
				resourceLoadOk(URL, true);
				res({ ok: true, name, res: json });
			} catch (error) {
				resourceLoadOk(URL, false);
				res({ ok: false, error: error.message, name });
			}
		});
	}

	function loadResource (URL, type, name) {
		if (type == 'sprite') return loadSprite(URL, name);
		if (type == 'json') return loadJSON(URL, name);
	}

	async function loadResources () {
		const resourcesCount = resourcesMap.resources.length + resourcesMap.maps.length;

		for (let a = 0; a < resourcesMap.resources.length; a++) {
			const resource = resourcesMap.resources[a];
			const response = await loadResource(`res/${resource.path}${resource.name}.${resource.extension}`, resource.type, resource.name);
			
			if (response.ok) loadedResourcesMap.resources[response.name] = response.res;

			console.log('load' + (response.ok ? 'ed' : ' failed') + ': ' + response.name + '\nprogress: ' + (loadedResources.length * 100 / resourcesCount).toFixed(2) + ' %');
		}

		for (let a = 0; a < resourcesMap.maps.length; a++) {
			const resource = resourcesMap.maps[a];
			const response = await loadResource(`res/${resource.path}${resource.name}.${resource.extension}`, resource.type, resource.name);
			
			if (response.ok) loadedResourcesMap.maps[response.name] = response.res;

			console.log('load' + (response.ok ? 'ed' : ' failed') + ': ' + response.name + '\nprogress: ' + (loadedResources.length * 100 / resourcesCount).toFixed(2) + ' %');
		}

		console.log(loadedResourcesMap);
		window['INSECT_REALM'].init(loadedResourcesMap);
	}

	async function loadResourceMap () {
		try {
			const response = await fetch('res/resources.json');

			if (!response.ok) return;

			resourcesMap = await response.json();
			loadResources();
		} catch (error) {
			console.error(error);
		}
	}

	loadResourceMap();
})();
