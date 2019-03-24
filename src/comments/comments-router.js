/* eslint-disable strict */
const express = require('express');
const CommentsService = require('./comments-service');
const xss = require('xss');

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

function sanitizeComment(comment) {
  return {
    id: comment.id,
    comment: xss(comment.comment),
    modified: comment.modified,
  };
}

commentsRouter
  .route('/')
  .get((req, res, next) => {
    const dbInstance = req.app.get('db');
    CommentsService.getAllComments(dbInstance)
      .then(comments => {
        return res.json(comments.map(comment => sanitizeComment(comment)));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const dbInstance = req.app.get('db');
    const { comment } = req.body;
    const newComments = { comment };
 
    for(const [key, value] of Object.entries(newComments)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    CommentsService.insertComments(dbInstance, newComments)
      .then(comment => {
        res
          .status(201)
          .location(`/comment/${comment.id}`)
          .json(sanitizeComment(comment));
      })
      .catch(next);
  });

commentsRouter
  .route('/:commentId')
  .all((req, res, next) => {
    CommentsService.getCommentsById(req.app.get('db'), req.params.commentId)
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: {message: `Comment with id ${req.params.id} not found` }
          });
        }
        res.comment = comment;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const dbInstance = req.app.get('db');
    const { commentId } = req.params;
    CommentsService.getCommentsById(dbInstance, commentId)
      .then(comment => {
        return res.json(sanitizeComment(comment));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { commentId } = req.params;
    CommentsService.deleteComments(req.app.get('db'), commentId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });


module.exports = commentsRouter;
  