/* eslint-disable strict */
const express = require('express');
const NotesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

function sanitizeNote(note) {
  return {
    id: note.id,
    note_title: xss(note.note_title),
    content: xss(note.content),
    modified: note.modified,
  };
}

notesRouter
  .route('/')
  .get((req, res, next) => {
    const dbInstance = req.app.get('db');
    NotesService.getAllNotes(dbInstance)
      .then(notes => {
        return res.json(notes.map(note => sanitizeNote(note)));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const dbInstance = req.app.get('db');
    const { note_title, content } = req.body;
    const newNotes = { note_title, content };
 
    for(const [key, value] of Object.entries(newNotes)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    NotesService.insertNotes(dbInstance, newNotes)
      .then(note => {
        res
          .status(201)
          .location(`/note/${note.id}`)
          .json(sanitizeNote(note));
      })
      .catch(next);
  });


module.exports = notesRouter;
  