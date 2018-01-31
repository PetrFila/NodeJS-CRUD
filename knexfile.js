//This module connects to our database

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/CRUD',
    migrations: {
        directory: __dirname + '/migrations'
    },
    seeds: {
        directory: __dirname + '/seeds'
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/testCRUD',
    migrations: {
        directory: __dirname + '/migrations'
    },
    seeds: {
        directory: __dirname + '/seeds'
    }
  }
}
