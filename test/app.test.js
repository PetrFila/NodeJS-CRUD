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

  it('Creates a record', (done) => {
    request(app)
    .post('/api/v1/stickers/')
    .send(fixtures.sticker)
    .set('Accept', 'application/json')//this is the header coming back with the data
    .expect('Content-Type', /json/)
    .expect(201)
    .then((response) => {
      expect(response.body).to.be.a('object')
      fixtures.sticker.id = response.body.id //
      expect(response.body).to.deep.equal(fixtures.sticker)
      done()
    })
  })

  it('Updates a record', (done) => {
    fixtures.sticker.rating = 5 //updating the rating
    request(app)
    .put('/api/v1/stickers/10')
    .send(fixtures.sticker)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then((response) => {
      expect(response.body).to.be.a('object')
      expect(response.body).to.deep.equal(fixtures.sticker)
      done()
    })
  })

});
