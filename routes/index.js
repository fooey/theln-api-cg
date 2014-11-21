'use strict';


module.exports = function(server, restify) {


	server.get('/', dumpRoute);



	/*
	*	LOCAL-MECHANICS
	*/

	require('./local-mechanics')(server, restify);




	function dumpRoute(req, res) {
		res.send(req.params);
	}


};
