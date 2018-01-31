* this guide assumes that Postgres database server is already installed and running

## Generating Node JS app with Express

- create a folder
- inside of the folder run yarn (or npm) init and answer all the questions
- run yarn add express-generator - this will download the Express generator
- run yarn express - this will install complete app skeleton using the above mentioned generator
- in the root directory of the application run touch .gitignore - This will create that a file in which we can store other files's names to be ignored when pushing to git/github

- run `createdb` and a name of the database
- `dropdb` + the name will delete the database
- if you accidentally don't assign any name you can run `psql` and it will open the last created database showing the name of the database
- `\q`  will quit the database


## Adding KNEX JS and Postgres to the app and creating connection between those modules

### KNEX is a middleware for Postgres and Node - something like Mongoose for Mongo DB and Node JS

- run following `npm install knex --save -g` and `npm install pg --save -g`
- in the app root directory create a new file "knexfile.js"
- create following object inside of the file  
```
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
  }
}
```

### ERD, migration file and seed file

![](https://j3qtcg.dm2302.livefilestore.com/y4mB-uM06o9N8uV3TFVkxIUQg11vVHoeHhjGCtTWwJu82w2Gc5YP474W0cJVNMv3AJ5oZyRozMsBc-ZIDNWL5dLp2cEQ0C6JjmxEtqOhkoOV-Pxafw0wcJInR07QVEOYsltsLiuMJLd-bvL5F2arhGLCFrao-2S5dtqyIzsxHQgl6JBhCRojX0bvXu9Ot94tM9w7empYU2yiczHe2krMYqnRQ?width=328&height=323&cropmode=none)

- in terminal run `knex migrate:make create-sticker` (create-sticker is a name of the migration file)
- create a table schema inside of the migration file
- run `knex migrate:latest` for the migration
- checkout the new table in the database `psql nameOfTheDatabase` and then `\dt` to display tables
- `\d tableName` will display the structure of the table


#### Seed file

- run `knex seed:make 01_sticker` It's a good practice to name the seed files with numbers as they run in alphabetical order
- created a file 'stickers.js' and pasted sample data in it as an array of JSON objects. This array is exported to '01_sticker.js' file
- migrate the seed data to the database `knex seed:run`
- checkout the database same as before plus use SQL query `SELECT * FROM sticker;` (where sticker is the table name)


### Setting up Express server and API

- remove view rendering from app.js
- remove entire view folder
- remove routes folder
- remove static serve from app.js
- remove public folder
- remove jade from package.json `npm uninstall jade`
- update error handler in app.js

```
// error handler
app.use(function(err, req, res, next) {

  // render the error message
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});
```
- run `npm install` to make sure all remaining packages are installed
- run `npm start` to start the application
- in the browser, open `localhost:3000` and you should see following message:
```
{
  message: "Not Found",
  error: {
    status: 404
  }
}
```

- create a new folder in the app root directory called 'api'
- inside of the new folder create a new file called 'stickers.js'
- add the following code to the new file:
```
const express = require('express');


const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: '👽'
  })
})

module.exports = router;
```

- add following code to your app.js :
```
const stickers = require('./api/stickers')

app.use('/api/v1/stickers', stickers) //this goes between middleware and error catcher codes
```

- install nodemon for development only `npm install nodemon --save-dev`
- inside of the package.json add following line `"dev": "nodemon"` to the scripts section, after the start option

### Creating database connection file
##### The idea behind the following code is that the app will use different database no matter what environment it is on. That means it will use a local database when on a local machine and a dedicated database from another hosting provider when deployed.

- create a new folder called 'db'
- inside of the new folder create a new file 'knex.js'
- paste there following code:
```
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex');
const config = require('../knexfile');
const environmentConfig = config[environment];
const connection = knex(environmentConfig)

module.exports = connection;

```

- create a new file 'queries.js' inside the db folder
- paste there following code including those comments to help you understand what the code is about:
```
//this is a query file to be used for CRUDing against the database

const knex = require('./knex') //requiring connection from the knex.js


//this module contains queries to manipulate the database
module.exports = {
  getAll() {
    return knex('sticker');
  }
}
```

- go to stickers.js file and replace the GET request with following code:
```
router.get('/', (req, res) => {
  queries.getAll()
  .then(stickers => {
    res.json(stickers);
  })

})
```

- refresh your webpage. It should display data from the database

### Testing

- install libraries for testing `npm install --save-dev mocha chai supertest`
- update 'knexfile.js' by adding additional environment:
```
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
```
- create a new folder called Test
- inside of the new folder create a new file 'app.test.js'
- paste there following:
```
describe('CRUD Stickers', () => {

});
```
- update your 'package.json' by adding `"test": "mocha"` in to scripts
- try to run the test by using `npm test` command
- if it works update your package.json test script like this `"(dropdb --if-exists testCRUD && createdb testCRUD) && NODE_ENV=test mocha"` and run the test again
- update the app.test.js file:
```
describe('CRUD Stickers', () => {
  before((done) => {
    //run migrations
    knex.migrate.latest()
    .then(() => {
      //run seeds
      return knex.seed.run()
    }).then(() => done());

  });

  it('Works...', () => {
    console.log("It's working!")
  });
});
```
- run the test again
- check the database as well
