"use strict";

/*
*	http://hostname/lm*
*/

const _ = require('lodash');

const citygrid = require(GLOBAL.paths.getService('citygrid'));



module.exports = function(server, restify) {


	/*
	*	Place
	*/

	server.get('/lm/place/:id', function(req, res) {
		citygrid.getPlace(
			req.params.id,
			req.headers['client_ip'] || req.ip,
			req.headers['user-agent'],
			returnJson.bind(null, req, res)
		);
	});



	/*
	*	Places
	*/

	server.get(/\/lm\/places\/([0-9.,;-]+)/, function(req, res) {
		var coords = req.params[0];

		citygrid.getPlacesLoc(
			coords,
			req.query,
			returnJson.bind(null, req, res)
		);
	});

	server.get('/lm/places/:stateName/:cityName', function(req, res) {
		citygrid.getPlaces(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});



	/*
	*	Reviews
	*/

	server.get('/lm/reviews/:stateName/:cityName', function(req, res) {
		citygrid.getReviews(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});

	server.get(/\/lm\/reviews\/([0-9.,;-]+)/, function(req, res) {
		var coords = req.params[0];

		citygrid.getReviewsLoc(
			coords,
			req.query,
			returnJson.bind(null, req, res)
		);
	});



	/*
	*	Offers
	*/

	server.get('/lm/offers/:stateName/:cityName', function(req, res) {
		citygrid.getOffers(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});

	server.get(/\/lm\/offers\/([0-9.,;-]+)/, function(req, res) {
		var coords = req.params[0];

		citygrid.getOffersLoc(
			coords,
			req.query,
			returnJson.bind(null, req, res)
		);
	});


	return server;
};



function returnJson(req, res, err, data) {
	const cacheTime = 60 * 15; // 15 minutes

	res.set({
		'Cache-Control': 'public, max-age=' + (cacheTime),
		'Expires': new Date(Date.now() + (cacheTime * 1000)).toUTCString(),
	});

	res.send(data);
}



function dumpRoute(req, res) {
	res.send({
		params: req.params,
		query: req.query,
		url: req.originalUrl,
	});
}
