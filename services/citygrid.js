"use strict";




/*
*	EXPORT
*/

module.exports = {
	getPlace: getPlace,
	getPlaces: getPlaces,
	getReviews: getReviews,
	getOffers: getOffers,
};



/*
*	DEPENDENCIES
*/

const url = require('url');

const _ = require('lodash');

const net = require(GLOBAL.paths.getService('net'));


const baseParams = {
	publisher: process.env.CITYGRID_PUBLISHER,
	format: 'json',
	// sort: this.props.sort,
};

const endpoints = {
	place: '/content/places/v2/detail',
	places: '/content/places/v2/search/where',
	reviews: '/content/reviews/v2/search/where',
	offers: '/content/offers/v2/search/where',
};



/*
*	PUBLIC METHODS
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

function getPlaces(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('places', where, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}


function getReviews(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('reviews', where, filters, function(err, jsonData) {
		fnCallback(err, jsonData);
	});
}


function getOffers(stateName, cityName, filters, fnCallback) {
	const where = cityName + ',' + stateName;

	getWhere('offers', where, filters, function(err, jsonData) {
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
	const defaultFilters = {
		page: 1,
		rpp: 10,
		sort: 'topmatches', // dist, alpha, highestrated, mostreviewed, topmatches, offers
	};

	const params = {
		tag: 268,
		where: where,

		page: filters.page || defaultFilters.page,
		rpp: filters.rpp || defaultFilters.rpp,
		sort: filters.sort || defaultFilters.sort,
	};

	get(endpoint, params, function(err, jsonData) {
		fnCallback(err, jsonData);
	});

}