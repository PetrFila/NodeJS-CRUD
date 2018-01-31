//this is a query file to be used for CRUDing against the database

const knex = require('./knex') //requiring connection from the knex.js


//this module contains queries to manipulate the database
module.exports = {
  getAll() {
    return knex('sticker');
  },
  getOne(id) {
    return knex('sticker').where('id', id).first(); //.first only returns one row
  }
}
