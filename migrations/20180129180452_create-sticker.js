//here we describe what goes up to the databse - creating a table
exports.up = function(knex, Promise) {
                                  //this is a name of the table and (table) is a callback function
  return knex.schema.createTable('sticker', (table) => {
    table.increments(); //this is the ID column
    table.text('title');
    table.text('description');
    table.float('rating');
    table.text('url');
  })

};
//droping a table
exports.down = function(knex, Promise) {
  return knex.dropTable('sticker');

};
