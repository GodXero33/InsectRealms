function map (val, cmin, cmax, tmin, tmax) {
	return (val - cmin) * (tmax - tmin) / (cmax - cmin) + tmin;
}

export {
	map
};
