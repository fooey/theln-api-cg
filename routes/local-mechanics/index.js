"use strict";

/*
*	http://hostname/lm*
*/
const util = require('util');

const _ = require('lodash');

const citygrid = require(GLOBAL.paths.getService('citygrid'));



module.exports = function(app, express) {
	var router = express.Router();


	router.get('/place/:id', function(req, res) {
		citygrid.getPlace(req.params.id, req.ip, req.headers['user-agent'], function(err, data) {
			res.json(data);
		});
	});

	router.get('/places/:stateName/:cityName', function(req, res) {
		citygrid.getPlaces(req.params.stateName, req.params.cityName, req.query, function(err, data) {
			res.json(data);
		});
	});
	router.get('/reviews/:stateName/:cityName', function(req, res) {
		citygrid.getReviews(req.params.stateName, req.params.cityName, req.query, function(err, data) {
			res.json(data);
		});
	});
	router.get('/offers/:stateName/:cityName', function(req, res) {
		citygrid.getOffers(req.params.stateName, req.params.cityName, req.query, function(err, data) {
			res.json(data);
		});
	});


	return router;
};



function dumpRoute(req, res) {
	res.json({
		params: req.params,
		query: req.query,
		url: req.originalUrl,
	});
}