* this guide assumes that Postres database server is already installed and running

## Generating Node JS app with Express

- create a folder
- inside of the folder run yarn (or npm) init and answer all the questions
- run yarn add express-generator - this will download the Express generator
- run yarn express - this will install complete app skeleton using the above mentioned generator
- in the root directory of the application run touch .gitignore - This will create that a file in which we can store other files's names to be ignored when pushing to git/github

- run `createdb` and a name of the database
** `dropdb` + the name will delete the database
** if you accidentally don't assign any name you can run `psql` and it will open the last created database showing the name of the database
** `\q`  will quit the database


## Adding KNEX JS and Postgres to the app and creating connection between those modules

### KNEX is a middleware for Postgres and Node - something like Mongoose for Mongo DB and Node JS

- run following `npm install knex --save -g` and `npm install pg --save -g`
- in the app root directory create a new file "knexfile.js"
- create following object inside of the file  
```
  module.exports = {
    development: {
      client: 'postgresql',
      connection: 'postgres://localhost/CRUD'
      }
    }
  }
```

### ERD and migration file

![](https://j3qtcg.dm2302.livefilestore.com/y4mB-uM06o9N8uV3TFVkxIUQg11vVHoeHhjGCtTWwJu82w2Gc5YP474W0cJVNMv3AJ5oZyRozMsBc-ZIDNWL5dLp2cEQ0C6JjmxEtqOhkoOV-Pxafw0wcJInR07QVEOYsltsLiuMJLd-bvL5F2arhGLCFrao-2S5dtqyIzsxHQgl6JBhCRojX0bvXu9Ot94tM9w7empYU2yiczHe2krMYqnRQ?width=328&height=323&cropmode=none)

- in terminal run `knex migrate:make create-sticker` (create-sticker is a name of the migration file)
- create a table schema inside of the migration file
- run `knex migrate:latest` for the migration
- checkout the new table in the database `psql nameOfTheDatabase` and then `\dt` to display tables
- `\d tableName` will display the structure of the table
