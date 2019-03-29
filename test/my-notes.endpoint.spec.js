/* eslint-disable strict */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Notes Endpoints', function() {
  let db;

  const { testUsers, testNotes, testComments } = helpers.makeNotesFixtures();
  const testUser = testUsers[0];

  // NOTE: mocha hooks
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  // NOTE: GET tests begin
  describe('GET /api/my-notes', () => {
    context('Given no notes', () => {
      beforeEach('insert users', () => {
        helpers.seedNotesTables(db, testUsers);
      });
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/my-notes')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .expect(200, []);
      });
    });
  });

  describe('POST /api/add-note', () => {
    context('User with no token', () => {
      it('responds with 401 unauthorized', () => {
        return supertest(app)
          .get('/api/my-notes')
          .expect(401);
      });
    });

    context('wrong or invalid token', () => {
      it('responds with 401 unauthorized', () => {
        return supertest(app)
          .post('/api/add-note')
          .set('Authorization', helpers.makeAuthHeader(testUser, 'wrongToken'))
          .expect(401);
      });
    });

    context('With correct bearer token and no notes present', () => {
      before('insert notes', () =>
        helpers.seedNotesTables(
          db,
          testUsers
        )
      );
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/my-notes')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .expect(200, []);
      });
    });

  });
});
