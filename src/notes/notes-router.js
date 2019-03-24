/* eslint-disable strict */
const express = require ('express');
const NotesService = require ('./notes-service');
const notesRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

const AuthService = require('../auth/auth-service');

notesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    return NotesService.getAllNotes(req.app.get('db'), req.user.user_name)
      .then(notes => {
        res.status(200);
        res.json(NotesService.serializeNotes(notes));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;
  })
  .delete(jsonBodyParser, (req,res,next) => {
    return NotesService.deleteNote(req.app.get('db'), req.body.noteId)
      .then(() => {
        res.status(200);
        res.end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    console.log(req.body);
    return NotesService.updateNote(req.app.get('db'), req.body)
      .then((note) => {
        res.status(200);
        res.json(note);
      })
      .catch(next);
  });

module.exports = notesRouter;