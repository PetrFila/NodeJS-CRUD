//this is a query file to be used for CRUDing against the database

const knex = require('./knex') //requiring connection from the knex.js


//this module contains queries to manipulate the database
module.exports = {
  getAll() {
    return knex('sticker');
  },
  getOne(id) {
    return knex('sticker').where('id', id).first(); //.first only returns one row
  },
  //creates a new instance in the database and returns array of stickers
  create(sticker) {
    return knex('sticker').insert(sticker,'*')
  },
  update(id, sticker) {
    //return a sticker where the requested ID is equal to the ID in the database, update that record and return the entire database as an array
    return knex('sticker').where('id', id).update(sticker, '*')
  }
}
