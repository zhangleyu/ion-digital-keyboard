var LocationConv = {};
LocationConv.wgs2bd = function(lat, lon) {
	var wgs2gcj = LocationConv.wgs2gcj(lat, lon);
	var gcj2bd = LocationConv.gcj2bd(wgs2gcj[0], wgs2gcj[1]);
	return gcj2bd;
}

LocationConv.gcj2bd = function(lat, lon) {
	var pi = 3.14159265358979324;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var x = lon, y = lat;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	var bd_lon = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lat, bd_lon];
}

LocationConv.bd2gcj = function (lat, lon) {
	var pi = 3.14159265358979324;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var x = lon - 0.0065, y = lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gg_lon = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return [gg_lat, gg_lon];
}

LocationConv.wgs2gcj = function (lat, lon) {
	var pi = 3.14159265358979324;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var dLat = LocationConv.transformLat(lon - 105.0, lat - 35.0);
	var dLon = LocationConv.transformLon(lon - 105.0, lat - 35.0);
	var radLat = lat / 180.0 * pi;
	var magic = Math.sin(radLat);
	magic = 1 - ee * magic * magic;
	var sqrtMagic = Math.sqrt(magic);
	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
	dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
	var mgLat = lat + dLat;
	var mgLon = lon + dLon;
	loc = [mgLat, mgLon];
	return loc;
}

LocationConv.transformLat = function (lat, lon) {
	var pi = 3.14159265358979324;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat));
	ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi  / 30.0)) * 2.0 / 3.0;
	return ret;
}

LocationConv.transformLon = function (lat, lon) {
	var pi = 3.14159265358979324;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

	var ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat));
	ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 * Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0;
	return ret;
}
