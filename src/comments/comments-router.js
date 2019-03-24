/* eslint-disable strict */
const express = require ('express');
const jsonBodyParser = express.json();
const commentRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth')
const commentService = require('./comments-service');

commentRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { comment, noteId } = req.body;
    if(!req.body['comment'])
      return res.status(400)
        .json({
          error: 'Missing comment in request body'
        });

    return commentService.insertComment(req.app.get('db'), comment, noteId)
      .then( comment => {
        res.status(201);
        res.json(commentService.serializeComment(comment));
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req,res,next) => {
    return commentService.deleteComment(req.app.get('db'), req.body.id)
      .then(() => {
        res.status(200);
        res.end();
      })
      .catch(next);
  });

commentRouter
  .route('/:noteId')
  .all(requireAuth)
  .get(jsonBodyParser, (req, res, next) => {      
    return commentService.getComments(req.app.get('db'), Number(req.params.noteId))
      .then( comments => {
        res.status(200);
        res.json(commentService.serializeCommentsList(comments));
      })
      .catch(next);
  });
    

module.exports = commentRouter;