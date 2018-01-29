//This module connects to our database

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'postgres://localhost/CRUD'
    }
  }
}
