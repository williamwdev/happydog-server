/* eslint-disable strict */
const AuthService = require('../auth/auth-service');
const xss = require('xss');

const addNoteService = {
  insertNote(db, user, name){
    return AuthService.getUserWithUserName(db, user)
      .then(user => {
        return db
          .insert({user_id: user.id, name})
          .into('happydog_notes')
          .returning('*')
          .then(([note]) => note);
      });
  },

  serializeNote(note){
    return {
      id: note.id,
      name: xss(note.name),
      date_created: note.date_created,
      user_id: note.user_id
    };
  }
};

module.exports = addNoteService;