const Server = require('./server');
const Routes = require('../routes');

describe('Testing the Hapi server that processes the requests', () => {
    test('Should return 200 status code for sucessful GET request', (done) => {
        const request = {
          method: 'GET',
          url: '/books',
        };
        Server.inject(request, (response) => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
});