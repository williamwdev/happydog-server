/* eslint-disable strict */

const xss = require('xss');

//NOTE: confused what values to get for checklist to display checked item from db
const ChecklistService = {
  getAllChecked(db, user) {
    return db
      .from('happydog_checklist')
      .join('happydog_users', 'happydog_checklist.user_id', '=', 'happydog_users.id')
      .select('happydog_checklist.ischecked', 'happydog_notes.id')
      .where('happydog_users.user_name', '=', user);
  },


};

module.exports = ChecklistService;