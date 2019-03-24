/* eslint-disable strict */

const xss = require('xss');

const notesService = {
  getAllNotes(db, user) {
    return db
      .from('happydog_notes')
      .join('happydog_users', 'happydog_notes.user_id', '=', 'happydog_users.id')
      .select('happydog_notes.name', 'happydog_notes.id')
      .where('happydog_users.user_name', '=', user);
  },

  deleteNote(db, id){
    return db
      .from('happydog_notes')
      .where('id', id)
      .del();
  },
  
  updatenote(db, note) {
    return db
      .from('happydog_notes')
      .where({id: note.id})
      .update({
        complete: note.complete
      })
      .returning('*');
  },
  
  serializeNotes(notes) {
    return notes.map((note) => this.serializeNote(note));
  },

  serializeNote(note) {
    return {
      id: note.id,
      name: xss(note.name),
      date_created: note.date_created,
      user_id: note.user_id
    };
  }
};

module.exports = notesService;