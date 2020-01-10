const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders Get Request'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    };
    res.status(201).json({
        message: 'Orders Post Request',
        order : order
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