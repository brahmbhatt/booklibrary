// const Models = require('../models');
const https = require('https');

module.exports = [{
	method: 'GET',
	path: '/books',
	handler: (request, reply)=>{
		let str = '';
		let jsonObject = {};
		https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (response)=>{
			response.setEncoding('utf8');
			response.on('data', (data)=>{
				str = str+data;
			});
			response.on('end', ()=>{
				 jsonObject = JSON.parse(str);
				 console.log(jsonObject);
				reply({
					data: str,
					statusCode: 200,
				});
			});
		});

	}
}];