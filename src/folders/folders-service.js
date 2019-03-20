/* eslint-disable strict */
const foldersService = {
  getAllFolders(db) {
    return db.select('*').from('happydog_folders');
  },
  insertFolder(db, newFolder) {
    return db.insert(newFolder).into('happydog_folders').returning('*').then(rows => rows[0]);
  },
  getFolderById(db, id) {
    return db('happydog_folders').select('*').where('id', id).first();
  },
  deleteFolder(db, id) {
    return db('happydog_folders').where('id', id).delete();
  },
  updateFolder(db, id, newFolder) {
    return db('happydog_folders').where('id', id).first().update(newFolder);
  }
};
  
module.exports = foldersService;