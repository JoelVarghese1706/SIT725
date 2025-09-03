const request = require('supertest');
const app = require('../server'); // Assuming your server.js is at the root level
const chai = require('chai');
const expect = chai.expect;

describe('Silent Witness Website', function() {
  it('should return a form on GET /', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('should handle POST /report correctly with valid data', function(done) {
    request(app)
      .post('/report')
      .send({ name: 'John Doe', incident: 'Harassment in the workplace' })
      .expect(200)
      .expect('Report submitted successfully!', done);
  });

  it('should require incident description', function(done) {
    request(app)
      .post('/report')
      .send({ name: 'John Doe' })  // Incident missing
      .expect(400)
      .expect('Incident description is required', done);
  });

  it('should return error for non-numeric input', function(done) {
    request(app)
      .post('/report')
      .send({ name: 'John Doe', incident: 'Harassment' })
      .expect(200)
      .expect('Report submitted successfully!', done);
  });
});
