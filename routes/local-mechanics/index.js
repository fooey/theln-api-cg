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
		citygrid.getPlace(
			req.params.id,
			req.ip,
			req.headers['user-agent'],
			returnJson.bind(null, req, res)
		);
	});

	router.get('/places/:stateName/:cityName', function(req, res) {
		citygrid.getPlaces(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});
	router.get('/reviews/:stateName/:cityName', function(req, res) {
		citygrid.getReviews(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});
	router.get('/offers/:stateName/:cityName', function(req, res) {
		citygrid.getOffers(
			req.params.stateName,
			req.params.cityName,
			req.query,
			returnJson.bind(null, req, res)
		);
	});


	return router;
};



function returnJson(req, res, err, data) {
	if (req.query.callback) {
		res.jsonp(data);
	}
	else {
		res.jsonp(data);
	}
}



function dumpRoute(req, res) {
	res.json({
		params: req.params,
		query: req.query,
		url: req.originalUrl,
	});
}