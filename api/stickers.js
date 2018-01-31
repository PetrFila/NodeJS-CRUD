const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

//this middleware validates the id. If it's not a number it displays na error message
function isValidId(req, res, next) {
  if(!isNaN(req.params.id))
    return next()
  next(new Error('Invalid ID'))
}

//returns all records from the database
router.get('/',  (req, res) => {
  queries.getAll()
  .then(stickers => {
    res.json(stickers);
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

module.exports = router;
