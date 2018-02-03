const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

//this middleware validates the id. If it's not a number it displays na error message
function isValidId(req, res, next) {
  if(!isNaN(req.params.id))
    return next()
  next(new Error('Invalid ID'))
}
//input validation
function validSticker(sticker){
  const hasTitle = typeof sticker.title == 'string' && sticker.title.trim()!= '';
  const hasDescription = typeof sticker.description == 'string' && sticker.description.trim()!= '';
  const hasRating = !isNaN(sticker.rating);
  const hasURL = typeof sticker.url == 'string' && sticker.url.trim()!= '';
  return hasTitle && hasDescription && hasRating && hasURL
}

//returns all records from the database
router.get('/',  (req, res) => {
  queries.getAll()
  .then(sticker => {
    res.json(sticker);
  })
})

//returns only one-specified-record from the database
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

//POST request
router.post('/',  (req, res, next) => {
    if(validSticker(req.body)) {
      //save it to the database
      queries.create(req.body)
      .then((sticker) => {
        res.status(201).json(sticker[0]) //it returns an array and gets the new entry from the first position
      })


    } else {
      //display error
      next(new Error('Invalid sticker'));
    }
})

//UPDATE request
router.put('/:id', isValidId, (req, res, next) => {
  console.log(req.body)
  if(validSticker(req.body)) {
    //update sticker
    queries.update(req.params.id, req.body) //the update will take the ID and apply the updates to the body
    .then((sticker) => {
      res.status(201).json(sticker[0])
    })
  } else {
    //display error
    next(new Error('Invalid sticker'));
  }

})


//DELETE request
router.delete('/:id', isValidId, (req, res) => {
  console.log(req.body)
  if(validSticker(req.body)) {
    //update sticker
    queries.delete(req.params.id)
    .then((sticker) => {
      res.json({
        deleted: true
      })
    })
  } else {
    //display error
    next(new Error('Invalid sticker'));
  }

})

module.exports = router;
