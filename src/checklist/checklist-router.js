/* eslint-disable strict */
const express = require('express');
const jsonBodyParser = express.json();
const checklistRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const ChecklistService = require('./checklist-service');

//TODO: POST & GET
//NOTE: cant figure out logic for saving checklist items
checklistRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    return ChecklistService.getAllChecked(req.app.get('db'), req.user.user_name)
      .then(ischecked => {
        res.status(200);
        res.json(ischecked);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { ischecked } = req.body;
  });


module.exports = checklistRouter;