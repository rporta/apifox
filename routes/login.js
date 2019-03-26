var async = require('async');
var express = require('express');
var router = express.Router();

var logger, mssql;

/*Request

{
"msisdn": "string",
"pin": "string",
"user_id": 0,
"country_code": "string",
"client_request_id": "string"
}

Response

{
"result": {
	"login_status": 0,
	"subscriber_status": 0,
	"billing_status": 0,
	"user_id": 0,
	"msisdn": "string",
	"carrier_id": 0,
	"server_response_id": "string"
},
"status": {
"code": 0,
"description": "string"
}
}*/

router.post('/', function(req, res, next) {
	logger = req.app.locals.logger;
	mssql = req.app.locals.mssql;

	var body = '';
	var result = '';
	req.on('data', function (data){ body += data; });
	req.on('end', function() {
		var data = JSON.parse(body);
		//console.log(data);
		logger.debug('Raw request: ' + body);
		if (data.msisdn && data.pin && data.user_id && data.country_code){
			login(data, function(err, rs){

				var response = {};
				
				if (!err){
					//aca preparar json de respuesta caso exitoso
					response['result'] = {};
					response.result['login_status'] = 0;
					response.result['subscriber_status'] = 0;
					response.result['billing_status'] = 0;
					response.result['msisdn'] = "string";
					response.result['carrier_id'] = 0;
					response.result['server_response_id'] = "string";
					response['status'] = {};
					response.status['code'] = 0;
					response.status['description'] = "string";

					res.send(response);
				}else{
					//aca preparar json de respuesta con error
					response['result'] = {};
					response['status'] = {};
					response.status['code'] = 0;
					response.status['description'] = "Invalid authorization header";
					res.status(400).send(response);
				}
			});
		}else{
			res.status(400).send({ status: -1});
		}
	});
});

function login(data, cb){
	async.waterfall([
		function a(cb){
			logger.info('Starting process...');
			cb(null, data);
		}],
		function(err, rs){
			console.log(rs);
			cb(null, rs);
		}
		)
}


module.exports = router;