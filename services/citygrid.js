"use strict";



/*
*	DEPENDENCIES
*/

const url = require('url');

const _ = require('lodash');

const net = require(GLOBAL.paths.getService('net'));




/*
*	EXPORT
*/

module.exports = {
	getPlace: getPlace,

	getPlaces: getPlaces,
	getPlacesLoc: getPlacesLoc,

	getReviews: getReviews,
	getReviewsLoc: getReviewsLoc,

	getOffers: getOffers,
	getOffersLoc: getOffersLoc,
};


const baseParams = {
	publisher: process.env.CITYGRID_PUBLISHER,
	format: 'json',
	// sort: this.props.sort,
};

const defaultFilters = {
	page: 1,
	rpp: 10,
	// sort: 'topmatches', // dist, alpha, highestrated, mostreviewed, topmatches, offers
};

const endpoints = {
	place: '/content/places/v2/detail',

	places: '/content/places/v2/search/where',
	placesLoc: '/content/places/v2/search/latlon',

	reviews: '/content/reviews/v2/search/where',
	reviewsLoc: '/content/reviews/v2/search/latlon',

	offers: '/content/offers/v2/search/where',
	offersLoc: '/content/offers/v2/search/latlon',
};



/*
*
*	PUBLIC METHODS
*
*/



/*
*	Place
*/

function getPlace(id, ipAddress, userAgent, fnCallback) {
	const params = {
		id: id,
		id_type: 'cs',
		client_ip: ipAddress,
		ua: userAgent,
	};

	get('place', params, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}



/*
*	Places
*/

function getPlaces(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('places', where, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}

function getPlacesLoc(coordsString, filters, fnCallback) {
	const bounds = parseCoords(coordsString).bounds;

	getLoc('placesLoc', bounds, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}



/*
*	Reviews
*/

function getReviews(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('reviews', where, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}

function getReviewsLoc(coordsString, filters, fnCallback) {
	const bounds = parseCoords(coordsString).bounds;

	getLoc('reviewsLoc', bounds, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}



/*
*	Offers
*/

function getOffers(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('offers', where, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}

function getOffersLoc(coordsString, filters, fnCallback) {
	const bounds = parseCoords(coordsString).bounds;

	getLoc('offersLoc', bounds, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}







/*
*	PRIVATE METHODS
*/

function get(endpoint, params, fnCallback) {
	const query = _.defaults(params, baseParams);

	const requestUrl = url.format({
		protocol: 'http:',
		host: 'api.citygridmedia.com',
		pathname: endpoints[endpoint],
		query: query
	});

	net.requestJson(requestUrl, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}



function getWhere(endpoint, where, filters, fnCallback) {
	var params = _.assign({
		tag: 268,
		where: where,
	}, filters);

	params = _.defaults(params, defaultFilters);

	console.log('params', params);

	get(endpoint, params, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}



function getLoc(endpoint, bounds, filters, fnCallback) {
	var params = {
		tag: 268,
		lat: bounds[0][0],
		lon: bounds[0][1],
	};

	if (bounds.length === 2) {
		params.lat2 = bounds[1][0];
		params.lon2 = bounds[1][1];
	}

	params = _.assign(params, filters);
	params = _.defaults(params, defaultFilters);

	console.log('params', params);

	get(endpoint, params, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}




/*
*	UTILITY METHODS
*/

function parseCoords(inStr) {
	const pairs = inStr.split(';');
 	var lats = [];
	var lons = [];

	_.each(pairs, function(pair) {
		var coord = pair.split(',');
		if (coord.length === 2) {
			lats.push(parseFloat(coord[0]));
			lons.push(parseFloat(coord[1]));
		}
	});

	const latMath = {
		min: arrayMin(lats),
		max: arrayMax(lats),
		avg: arrayAvg(lats),
	};
	const lonMath = {
		min: arrayMin(lons),
		max: arrayMax(lons),
		avg: arrayAvg(lons),
	};


	var bounds = [
		[latMath.min, lonMath.min],
	];

	if (latMath.min !== latMath.max && lonMath.min !== lonMath.max) {
		bounds.push([latMath.max, lonMath.max]);
	}

	return {
		pairs: pairs,
		lats: lats,
		latMath: latMath,

		lons: lons,
		lonMath: lonMath,

		bounds: bounds,
	};
}



function arrayMin(arr) {
	return Math.min.apply(Math, arr);
}

function arrayMax(arr) {
	return Math.max.apply(Math, arr);
}

function arraySum(arr) {
	return arr.reduce(function(sum, num) {
		return sum + num;
	}, 0);
}

function arrayAvg(arr) {
	return arraySum(arr) / arr.length;
}
