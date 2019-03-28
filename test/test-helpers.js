/* eslint-disable strict */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "pancake",
      password: "Pancake1234!"
    },
    {
      id: 2,
      user_name: "pancake1",
      password: "Pancake1234!"
    }
  ];
}

function makeNotesArray(user) {
  return [
    {
      id: 1,
      name: "first note"
    },
    {
      id: 2,
      name: "second note"
    }
  ];
}

function makeCommentsArray(user, notes) {
  return [
    {
      id: 1,
      content: "first test comment",
      due_date: "2019-3-29",
      note_id: 1
    },
    {
      id: 2,
      content: "second test comment",
      due_date: "2019-3-29",
      note_id: 1
    }
  ];
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
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("happydog_users").insert(preppedUsers);
}

function seedNotesTable(db, users, notes, comments = []) {
  return seedUsers(db, users)
    .then(() => db.into("happydog_notes")
    .insert(notes))
    .then(
      () => comments.length && db
      .into("happydog_comments")
      .insert(comments)
    );
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
  makeNotesFixtures,
  cleanTables,
  seedUsers,
  seedNotesTable,
  makeAuthHeader
};
