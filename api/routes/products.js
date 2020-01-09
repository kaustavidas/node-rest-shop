const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Get Request'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Post Request'
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if( id === 'special' ) {
        res.status(200).json({
            message: 'Special Product Found',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'Single Product Found',
            id: id
        })
    }
})


router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
      message: 'Updated Product'
  })
})


router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Product'
    })
})


module.exports = router;