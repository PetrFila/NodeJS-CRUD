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
- modify the console.log that it prints out the database content
- create a new file inside of the test folder called 'fixtures.js' and paste the console.log output there so the file looks like this:
```
const stickers = [
  { id: 1,
    title: 'JavaScript',
    description: 'JS Logo',
    rating: 10,
    url: 'http://devstickers.com/assets/img/pro/i4eg.png' },
  { id: 2,
    title: 'Rainbow JavaScript',
    description: 'JS Logo with Rainbow',
    rating: 10,
    url: 'http://devstickers.com/assets/img/pro/mw2g.png' },
  { id: 3,
    title: 'ES6',
    description: 'ES6 Logo',
    rating: 7,
    url: 'http://devstickers.com/assets/img/pro/i0dq.png' },
  { id: 4,
    title: 'JavaScript Beer',
    description: 'JS Beer Logo',
    rating: 7,
    url: 'http://devstickers.com/assets/img/pro/m539.png' },
  { id: 5,
    title: 'node.js hexagon',
    description: 'node.js hexagon logo',
    rating: 9,
    url: 'http://devstickers.com/assets/img/pro/iuw5.png' },
  { id: 6,
    title: 'node.js solid hexagon',
    description: 'node.js solid hexagon logo',
    rating: 8,
    url: 'http://devstickers.com/assets/img/pro/kh7x.png' },
  { id: 7,
    title: 'npm cube',
    description: 'npm logo in cube',
    rating: 6,
    url: 'http://devstickers.com/assets/img/pro/nrc3.png' },
  { id: 8,
    title: 'chai',
    description: 'chai.js logo',
    rating: 6,
    url: 'http://devstickers.com/assets/img/pro/5awx.png' },
  { id: 9,
    title: 'mocha',
    description: 'mocha.js logo',
    rating: 7,
    url: 'http://devstickers.com/assets/img/pro/4gem.png' }
  ]


module.exports = {
  stickers
}

```

- update the 'it' part of the 'app.test.js' file

```
it('Displays all stickers', (done) => {
  request(app)
    .get('/api/v1/stickers')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body).to.be.a('array');
      expect(response.body).to.deep.equal(fixtures.stickers)
      done();
    })

});

```
- run the test again

### Showing one record with GET request

- add new route to the api's 'sticker.js'
```
router.get('/:id', isValidId, (req,res) => {
  res.json({
    message: 'Hello!'
  })
})
```
- and a middleware above those two routes
```
function isValidId(req, res, next) {
  if(!isNaN(req.params.id))
    return next()
  next(new Error('Invalid ID'))
}
```
- run the link in the browser and add a number on the end (it should work) and then some letters (it should show an error message)
- modify the new router.get like this:
```
router.get('/:id', isValidId, (req,res, next) => {
  queries.getOne(req.params.id)
  .then(sticker => {
    if(sticker) {
      res.json(sticker)
    }
    else {
      next()
    }
  })
})
```
- modify queries.js in the db folder:
```
module.exports = {
  getAll() {
    return knex('sticker');
  },
  getOne(id) {
    return knex('sticker').where('id', id).first(); //.first only returns one row
  }
  ```
- testing the new functionality
- app.test.js
```
it('Displays one sticker by id', (done) => {
  request(app)
    .get('/api/v1/stickers/1')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.deep.equal(fixtures.stickers[0])
      done();
    })
});

it('Displays another sticker by different id', (done) => {
  request(app)
    .get('/api/v1/stickers/5')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.deep.equal(fixtures.stickers[4])
      done();
    })
});
```


### Saving - adding a new sticker to the database

- add new route to the api/stickers.js file
```
router.post('/',  (req, res, next) => {
    if(validSticker(req.body)) {
      //save it to the database
      queries.create(req.body)
      .then((sticker) => {
        res.status(201).json(sticker[0])
      })


    } else {
      //display error
      next(new Error('Invalid sticker'));
    }
})
```
- also add new validation function checking for the correct input data:
```
function validSticker(sticker){
  const hasTitle = typeof sticker.title == 'string' && sticker.title.trim()!= '';
  const hasURL = typeof sticker.url == 'string' && sticker.url.trim()!= '';
  return hasTitle && hasURL
}
```
- add a new query to the db/queries.js
```
create(sticker) {
  return knex('sticker').insert(sticker,'*')
}
```

##### Testing the POST - saving data functionality
- create a new input mock data in the test/fixtures.js and update the export as well
```
const sticker =  
{
  "title": "ms",
  "description": "Microsoft Logo",
  "rating": 10,
  "url": "http://devstickers.com/assets/img/pro/n8vc.png"
}


module.exports = {
stickers,
sticker
}
```
- create a new test in the app.test.js
```
it('Creates a record', (done) => {
  request(app)
  .post('/api/v1/stickers/')
  .send(fixtures.sticker)
  .set('Accept', 'application/json')//this is the header coming back with the data
  .expect('Content-Type', /json/)
  .expect(201)
  .then((response) => {
    expect(response.body).to.be.a('object')
    fixtures.sticker.id = response.body.id //
    expect(response.body).to.deep.equal(fixtures.sticker)
    done()
  })
})
```
