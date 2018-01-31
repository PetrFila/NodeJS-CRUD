const knex = require('../db/knex');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app')
const fixtures = require('./fixtures')

describe('CRUD Stickers', () => {
  before((done) => {
    //run migrations
    knex.migrate.latest()
    .then(() => {
      //run seeds
      return knex.seed.run()
    }).then(() => done());

  });

  it('Displays all stickers', (done) => {
    request(app)
      .get('/api/v1/stickers')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('array');
        expect(response.body).to.deep.equal(fixtures.stickers)
        done();
      })
  });

  it('Displays one sticker by id', (done) => {
    request(app)
      .get('/api/v1/stickers/1')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object');
        expect(response.body).to.deep.equal(fixtures.stickers[0])
        done();
      })
  });

  it('Displays another sticker by different id', (done) => {
    request(app)
      .get('/api/v1/stickers/5')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object');
        expect(response.body).to.deep.equal(fixtures.stickers[4])
        done();
      })
  });

});
