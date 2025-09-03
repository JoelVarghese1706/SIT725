const request = require('supertest');
const ioClient = require('socket.io-client');
const app = require('../server'); // we already export app from server.js

describe('Socket event on report', function () {
  this.timeout(5000); // allow a few seconds for socket roundtrip

  let socket;

  before((done) => {
    // connect to the running server on :3000
    socket = ioClient('http://localhost:3000', { transports: ['websocket'] });
    socket.on('connect', () => done());
    socket.on('connect_error', done);
  });

  after(() => {
    if (socket && socket.connected) socket.disconnect();
  });

  it('emits report_submitted when /report is posted', (done) => {
    // Listen once for the broadcast
    socket.once('report_submitted', (payload) => {
      try {
        if (payload.incident !== 'Test incident') throw new Error('Wrong incident text');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Trigger the server route which emits the socket event
    request(app)
      .post('/report')
      .send({ name: 'Tester', incident: 'Test incident' })
      .expect(200)
      .end((err) => err && done(err));
  });
});
