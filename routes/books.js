import { func } from '../../Library/Caches/typescript/2.6/node_modules/@types/joi';

const https = require('https');
const Models = require('../models');


module.exports = [
{
    method: 'GET',
    path: '/books',
    handler: (request, reply)=>{
        let str = '';
        let jsonObject = {};
        https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (response)=>{
            response.setEncoding('utf8');
            response.on('data', (data)=>{
                str = str + data;
            });
            response.on('end', ()=>{
                reply({
                    data: str,
                    statusCode: 200,
                });
            });
        });

    }
},
{
	method: 'GET',
	path: '/books/ratings',
	handler: (request, reply)=>{
		let str = '';
		let jsonObject = {};

		https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (outer)=>{
			outer.setEncoding('utf8');
			outer.on('data', (data)=>{
				str = str + data;
			});
			outer.on('end', ()=>{
				jsonObject = JSON.parse(str);

				for (let books in jsonObject.books){
					let id = jsonObject.books[books].id;
					https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/'+id, (inner)=>{
						let str1 = '';
						let obj = {};
						inner.setEncoding('utf8');
						inner.on('data', (data)=>{
							str1 = str1 + data;
						});
						inner.on('end', ()=>{
							obj = JSON.parse(str1);
							//console.log(obj);
						});
					});
				}

				reply({
					data: jsonObject,
					statusCode: 200,
				});

			});
		});
	}
},
{
	method: 'GET',
	path: '/books/combined',
	handler: (request, reply)=>{
		let str = '';
		let jsonObject = {};

		https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (outer)=>{
			outer.setEncoding('utf8');
			outer.on('data', (data)=>{
				str = str + data;
			});
			outer.on('end', ()=>{
				jsonObject = JSON.parse(str);

				for (let books in jsonObject.books){
					let id = jsonObject.books[books].id;
					https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/'+id, (inner)=>{
						let str1 = '';
						let obj = {};
						inner.setEncoding('utf8');
						inner.on('data', (data)=>{
							str1 = str1+data; 
						});
						inner.on('end', ()=>{
							obj = JSON.parse(str1);
							jsonObject.books[books]['rating'] = obj.rating;
						});
					});
				}

				reply({
                    data: grouping(jsonObject.books),
					statusCode: 200,
				});

			});
		});
	}
},
{method: 'GET',
path: '/books/combined',
handler: (request, reply)=>{
    let str = '';
    let jsonObject = {};

    https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (outer)=>{
        outer.setEncoding('utf8');
        outer.on('data', (data)=>{
            str = str + data;
        });
        outer.on('end', ()=>{
            jsonObject = JSON.parse(str);

            for (let books in jsonObject.books){
                let id = jsonObject.books[books].id;
                https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/'+id, (inner)=>{
                    let str1 = '';
                    let obj = {};
                    inner.setEncoding('utf8');
                    inner.on('data', (data)=>{
                        str1 = str1+data; 
                    });
                    inner.on('end', ()=>{
                        obj = JSON.parse(str1);
                        jsonObject.books[books]['rating'] = obj.rating;
                    });
                    //insertIntoDb(jsonObject.books);
                });
            }

            reply({
                data: grouping(jsonObject.books),
                statusCode: 200,
            });

        });
    });
}
}];
function grouping(array)
{
    let arr = []
    //console.log("obj", array);
    obj = {};
    for(let i = 0; i < array.length ; i++)
    {
        let key = array[i]['Author'];
        //console.log("key is:",key);
        if(obj[array[i]['Author']] === undefined)
        {
            obj[array[i]['Author']] = [].concat(array[i]);
        }
        else
        {
            //arr = obj[array[i]['Author']];
            obj[array[i]['Author']] = obj[array[i]['Author']].concat(array[i]);
        }
    }
    //console.log(obj);
    return obj;

}
function insertIntoDb(array)
{
    for(let i = 0; i < array.length ; i++)
    {
        Models.books.create({
            Author: array[i].Author,
            id: array[i].id,
            Name: array[i].Name,
            rating: array[i].rating
        })
    }
}
