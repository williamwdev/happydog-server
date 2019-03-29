/* eslint-disable strict */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Comments Endpoints', function() {
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

  // NOTE: tests begin
  describe('POST /api/comments', () => {
    context('When no token present', () => {
      it('responds with 401 unauthorized', () => {
        return supertest(app)
          .post('/api/comments')
          .expect(401);
      });
    });

    context('When given invalid bearer token', () => {
      it('responds with 401 unauthorized', () => {
        return supertest(app)
          .post('/api/comments')
          .set('Authorization', helpers.makeAuthHeader(testUser, 'invalidToken'))
          .expect(401);
      });
    });

    context(
      'When given valid token and there are no comments',
      () => {
        before('insert notes', () =>
          helpers.seedCommentsTables(db, testUsers, testNotes)
        );
        it('responds with 200 and an empty array', () => {
          return supertest(app)
            .get('/api/comments/1')
            .set(
              'Authorization',
              helpers.makeAuthHeader(testUser, process.env.JWT_SECRET)
            )
            .expect(200, []);
        });
      }
    );

    // NOTE: time zone issues
    // context(
    //   'When given valid bearer token and there are comments present',
    //   () => {
    //     before('insert notes', () =>
    //       helpers.seedCommentsTables(db, testUsers, testNotes, testComments)
    //     );
    //     it('responds with 200 and an array of correct comments', () => {
    //       return supertest(app)
    //         .get('/api/comments/1')
    //         .set(
    //           'Authorization',
    //           helpers.makeAuthHeader(testUser, process.env.JWT_SECRET)
    //         )
    //         .expect(200, [
    //           {
    //             id: 1,
    //             content: 'first test comment',
    //             // date_created: '2019-03-29T14:12:23.197Z',
    //             duedate: '2019-03-29T07:00:00.000Z',
    //             note_id: 1
    //           },
    //           {
    //             id: 2,
    //             content: 'second test comment',
    //             // date_created: '2019-03-29T14:12:23.197Z',
    //             duedate: '2019-03-29T07:00:00.000Z',
    //             note_id: 1
    //           }
    //         ]);
    //     });
    //   }
    // );
  });
});
