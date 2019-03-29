/* eslint-disable strict */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "pancake",
      full_name: "test pancake",
      password: "Pancake1234!"
    },
    {
      id: 2,
      user_name: "waffles",
      full_name: "test waffles",
      password: "Pancake1234!"
    }
  ];
}

function makeNotesArray(users) {
  return [
    {
      name: "Vet Visits",
      user_id: users[0].id
    },
    {
      name: "Vaccinations",
      user_id: users[0].id
    },
    {
      name: "Grooming",
      user_id: users[0].id
    },
    {
      name: "Beach Day",
      user_id: users[0].id
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
  const user = users.find(user => user.id === note.user_id);

  return {
    id: note.id,
    name: note.name,
    date_created: note.date_created,
    user: {
      id: user.id,
      full_name: user.full_name,
      user_name: user.user_name,
      password: user.password,
      date_created: user.date_created
    }
  };
}

function makeMaliciousNote(user) {
  const maliciousNote = {
    id: 911,
    date_created: new Date().toISOString(),
    name: "bad stuff",
    user_id: user.id
  };
  const expectedNote = {
    ...makeExpectedNote([user], maliciousNote),
    name: "bad stuff"
  };
  return {
    maliciousNote,
    expectedNote
  };
}

function makeNotesFixtures() {
  const testUsers = makeUsersArray();
  const testNotes = makeNotesArray(testUsers);
  const testComments = makeCommentsArray();
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
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("happydog_users").insert(preppedUsers);
}

function seedNotesTables(db, users, notes = []) {
  return seedUsers(db, users)
    .then(() => db.into("happydog_notes").insert(notes))
    .then(() => {});
}

function seedCommentsTable(db, users, notes, comments = []) {
  return seedNotesTable(db, users, notes)
    .then(() => db.into("happydog_comments").insert(comments))
    .then(() => {});
}

function seedMaliciousNote(db, user, note) {
  return seedUsers(db, [user]).then(() =>
    db.into("happydog_notes").insert([note])
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`;
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
  seedNotesTables,
  seedCommentsTable,
  makeAuthHeader
};
