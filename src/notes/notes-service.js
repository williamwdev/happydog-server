/* eslint-disable strict */
const NotesService = {
  getAllNotes(db, user_name) {
    return db
      .from('happydog_notes')
      .join('happydog_users', 'happydog_notes.user_id', '=', 'happydog_users.id')
      .select('happydog_notes.name', 'happydog_notes.id')
      .where('happydog_users.user_name', '=', user_name);
  },
  insertNote(db, newNote) {
    return db.insert(newNote).into('happydog_notes').returning('*').then(rows => rows[0]);
  },
  getNoteById(db, id) {
    return db('happydog_notes').select('*').where('id', id).first();
  },
  deleteNote(db, id) {
    return db('happydog_notes').where('id', id).delete();
  },
  updateNote(db, id, newNote) {
    return db('happydog_notes').where('id', id).first().update(newNote);
  }
};
  
module.exports = NotesService;