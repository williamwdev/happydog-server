/* eslint-disable strict */
const express = require('express');
const jsonParser = express.json();
const notesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();

function sanitizeNotes(note) {
  return {
    id: note.id,
    name: xss(note.name)
  };
}

notesRouter
  .route('/')
  .get((req, res, next) => {
    const dbInstance = req.app.get('db');
    notesService.getAllNotes(dbInstance)
      .then(notes => {
        return res.json(notes.map(note => sanitizeNotes(note)));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const dbInstance = req.app.get('db');
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({error: {message: 'Missing title in request body'}});
    }
    notesService.insertNotes(dbInstance, { name })
      .then(note => {
        res
          .status(201)
          .location(`/api/notes/${note.id}`)
          .json(sanitizeNotes(note));
      });
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    notesService.deleteNotes(req.app.get('db'), id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });


notesRouter
  .route('/:noteId')
  .all((req, res, next) => {
    const noteId = req.params.noteId;
    const db = req.app.get('db');
    notesService.getNotesById(db, noteId)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: {message: `Notes with id ${noteId} not found` }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const id = req.params.noteId;
    const db = req.app.get('db');
    notesService.deleteNotes(db, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const id = req.params.noteId;
    if (!name) {
      return res.status(400).json({error: { message: 'No updated fields were found to update from'}});
    }
    const newNotes = { name };
    const db = req.app.get('db');
    notesService.updateNotes(db, id, newNotes)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;