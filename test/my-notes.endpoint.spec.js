/* eslint-disable strict */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Notes Endpoints', function() {
  let db;

  const { testUsers } = helpers.makeNotesFixtures();
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

  // NOTE: tests begin

  describe('GET /api/my-notes', () => {
    context('Given no notes', () => {
      beforeEach('insert users', () => {
        helpers.seedNotesTable(db, testUsers);
      });
      it('responds with 200 and empty array', () => {
        // const validUser = testUsers[0];
        const invalidSecret = 'happy-dog-secret';
        return supertest(app)
          .get('/api/my-notes')
          .set('Authorization', helpers.makeAuthHeader(testUser, invalidSecret))
          .expect(200, []);
      });
    });
  });

});



















