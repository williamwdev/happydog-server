/* eslint-disable strict */
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs') 

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeNotesFixtures()
  const testUser = testUsers[0]
  
  // NOTE: mocha hooks
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })
  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  // NOTE: tests begin
  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['user_name', 'password', 'full_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          full_name: 'test full_name',
        }
        // TODO: tests for required fields
        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })
      // TODO: tests to see if password is longer than 8 chars
      it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          user_name: 'test user_name',
          password: '1234567',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be atleast 8 characters in length` })
      })
      // TODO: tests to see if pw is less than 72 charas using .repeat() method
      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          user_name: 'test user_name',
          password: '*'.repeat(73),
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be at most 72 characters in length` })
      })
      // TODO: test to see if pw starts with space
      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          user_name: 'test user_name',
          password: ' Password1234!',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })
      // TODO: test to see if pw ends with space
      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          user_name: 'test user_name',
          password: 'Password1234! ',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })
      // TODO: pw complexity test with REGEX, makes 4 checks: lower case, upper case, number and 1 of the specified special characters & no spaces
      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_name: 'test user_name',
          password: '11AAaabb',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
      })
      // TODO: checks for duplicate user_name in DB. Need to query the DB for a user with given user_name to see if match found
      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          user_name: testUser.user_name,
          password: 'Password1234!',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })
    // TODO: POST /api/user happy path
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_name: 'test user_name',
          password: 'Password1234!',
          full_name: 'test full_name',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.user_name).to.eql(newUser.user_name)
            expect(res.body.full_name).to.eql(newUser.full_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
          .expect(res =>
            db
              .from('happydog_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name)
                expect(row.full_name).to.eql(newUser.full_name)
                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})