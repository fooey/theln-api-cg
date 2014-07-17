"use strict";



/*
*	DEPENDENCIES
*/

const zlib = require('zlib');
const request = require('request');





/*
*	EXPORT
*/

module.exports = {
	requestJson: requestJson,
	requestCompressed: requestCompressed,
};





/*
*	PUBLIC METHODS
*/

function requestJson(requestUrl, fnCallback) {
	requestCompressed(requestUrl, function(err, data) {
		fnCallback(err, parseJson(data));
	});
};



function requestCompressed(requestUrl, fnCallback) {
	var requestOptions = {
		uri: requestUrl,
		headers: {"accept-encoding" : "gzip,deflate"}
	};

	console.log('requestOptions', requestOptions);
	
	var req = request.get(requestOptions);

	req.on('response', function(res) {
		var chunks = [];
		res.on('data', function(chunk) {
			chunks.push(chunk);
		});

		res.on('end', function() {
			var buffer = Buffer.concat(chunks);
			var encoding = res.headers['content-encoding'];
			if (encoding == 'gzip') {
				zlib.gunzip(buffer, function(err, decoded) {
					fnCallback(err, decoded && decoded.toString());
				});
			}
			else if (encoding == 'deflate') {
				zlib.inflate(buffer, function(err, decoded) {
					fnCallback(err, decoded && decoded.toString());
				});
			}
			else {
				fnCallback(null, buffer.toString());
			}
		});
	});

	req.on('error', function(err) {
		fnCallback(err);
	});
}





/*
*	PRIVATE METHODS
*/


function parseJson(data) {
	var results;

	try {
		results = JSON.parse(data);
	}
	catch (e) {}

	return results;
}