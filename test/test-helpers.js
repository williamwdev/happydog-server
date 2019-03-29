/* eslint-disable strict */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "pancake",
      full_name: 'test pancake',
      password: "Pancake1234!"
    },
    {
      id: 2,
      user_name: "pancake1",
      full_name: 'test pancake1',
      password: "Pancake1234!"
    }
  ];
}

function makeNotesArray(users) {
  return [
    {
      id: 1,
      name: 'Vet Visits',
    },
    {
      id: 2,
      name: 'Vaccinations',
    },
    {
      id: 3,
      name: 'Grooming',
    },
    {
      id: 4,
      name: 'Beach Day',
    }
  ];
}

function makeCommentsArray(users, notes) {
  return [
    {
      id: 1,
      content: "first test comment",
      duedate: "2019-3-29",
      note_id: 1
    },
    {
      id: 2,
      content: "second test comment",
      duedate: "2019-3-29",
      note_id: 1
    }
  ];
}

function makeExpectedNote(users, note) {
  const user = users
    .find(user => user.id === note.user_id)

  return {
    id: note.id,
    name: note.name,
    date_created: note.date_created,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      date_created: user.date_created,
    },
  }
}

function makeMaliciousNote(user) {
  const maliciousNote = {
    id: 911,
    date_created: new Date().toISOString(),
    name: 'bad stuff',
    user_id: user.id,
  }
  const expectedNote = {
    ...makeExpectedNote([user], maliciousNote),
    name: 'bad stuff',
  }
  return {
    maliciousNote,
    expectedNote,
  }
}

function makeNotesFixtures() {
  const testUsers = makeUsersArray();
  const testNotes = makeNotesArray(testUsers);
  const testComments = makeCommentsArray(testUsers, testNotes);
  return { testUsers, testNotes, testComments };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
            happydog_notes,
            happydog_users,
            happydog_comments
            RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const testUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("happydog_users").insert(testUsers);
}

function seedNotesTable(db, users, notes) {
  return seedUsers(db, users)
    .then(() => db.into("happydog_notes")
    .insert(notes))
}

function seedMaliciousNote(db, user, note) {

  return seedUsers(db, [user])
    .then(() =>
      db
        .into('happydog_notes')
        .insert([note])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

module.exports = {
  makeUsersArray,
  makeNotesArray,
  makeCommentsArray,
  makeExpectedNote,
  makeNotesFixtures,
  makeMaliciousNote,
  cleanTables,
  seedMaliciousNote,
  seedUsers,
  seedNotesTable,
  makeAuthHeader
};
