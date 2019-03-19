'use strict';

const NotesService = {
  getAllNotes(db) {
    return db.select('*').from('happydog_notes');
  },
  getNotesById(db, id) {
    return db.from('happydog_notes').select('*').where('id', id).first();
  },
  insertNotes(db, newNotes) {
    return db.insert(newNotes).into('happydog_notes').returning('*').then(rows => rows[0]);
  },
  deleteNotes(db, id) {
    return db('happydog_notes').where('id', id).delete();
  },
  updateNotes(db, id, newNotesFields) {
    return db.from('happydog_notes').select('*').where('id', id).first().update(newNotesFields).return('*').then(rows => rows[0]);
  }
};

module.exports = NotesService;