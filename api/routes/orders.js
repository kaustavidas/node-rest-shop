const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders Get Request'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Orders Post Request'
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
        res.status(200).json({
            message: 'Single order Found',
            id: id
        })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Order'
    })
})


module.exports = router;