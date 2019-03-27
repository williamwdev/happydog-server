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
      .then(value => {
        res.status(200);
        res.json(value);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { value } = req.body;
  });


module.exports = checklistRouter;