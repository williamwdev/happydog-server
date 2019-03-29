/* eslint-disable strict */

const xss = require('xss');

//NOTE: confused what values to get for checklist to display checked item from db
const ChecklistService = {
  getAllChecked(db, userId, value) {
    return db
      .from('happydog_checklist')
      .join('happydog_users', 'happydog_checklist.user_id', '=', 'happydog_users.id')
      .select('happydog_checklist.value', 'happydog_notes.id')
      .where('happydog_users.user_id', '=', userId)
      .where('happydog_users.value', '=', value)
      .where('happydog_users.date_created', '>', 'CURRENT_DATE');
  },
  createChecked(db, userId, value) {
    return db
      .insert({user_id: userId, value: value, date_created: new Date()})
      .into('happydog_checklist')
      .returning('*');
    // .then(([value]) => value);
  }


};

module.exports = ChecklistService;