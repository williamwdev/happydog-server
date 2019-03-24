/* eslint-disable strict */
const express = require ('express');
const addNoteService = require ('./add-note-service');
const addNoteRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

const AuthService = require('../auth/auth-service');

addNoteRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;
    const { user_name } = req.user;
    if (!req.body['name'])
      return res.status(400).json({
        error: 'Missing name in request body'
      });

    return addNoteService.insertNote(req.app.get('db'), user_name, name)
      .then(note => {
        res.status(201);
        res.json(addNoteService.serializeNote(note));
      })
      .catch(next);
  });

module.exports = addNoteRouter;