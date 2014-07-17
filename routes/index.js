'use strict';


module.exports = function(app, express) {


	app.get('/', dumpRoute);



	/*
	*	LOCAL-MECHANICS
	*/

	var mechanicsRouter = require('./local-mechanics')(app, express);
	app.use('/lm', mechanicsRouter);


	

	function dumpRoute(req, res) {
		res.send(req.params);
	}


};
