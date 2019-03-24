/* eslint-disable strict */
const xss = require('xss');

const commentService = {
  insertComment(db, comment, noteId){
    return db
      .insert({note_id: noteId, content: comment})
      .into('happydog_comments')
      .returning('*')
      .then(([comment]) => comment);
  },

  getComments(db, noteId){
    return db 
      .from('happydog_comments')
      .join('happydog_notes', 'happydog_notes.id', '=', 'happydog_comments.note_id')
      .select('happydog_comments.content', 'happydog_comments.date_created', 'happydog_comments.id')
      .where('happydog_notes.id', '=', noteId);
  },

  deleteComment(db, id){
    return db
      .from('happydog_comments')
      .where('id', id)
      .del();
  },

  serializeCommentsList(comments) {
    return comments.map((comment) => this.serializeComment(comment));
  },

  serializeComment(comment){
    return {
      id: comment.id,
      content: xss(comment.content),
      date_created: comment.date_created,
      date_modified: comment.date_modified,
      note_id: comment.note_id
    };
  }
};

module.exports = commentService;