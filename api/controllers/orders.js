const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
         .populate('product', 'name')
         .exec()
         .then(docs => {
             console.log(docs);
             const response = {
               count : docs.length,
               oders : docs.map(doc => {
                 return {
                    _id : doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                 }
               })
             }
            if(docs.length >= 0)
              res.status(201).json(response)
            res.status(404).json({
                message: 'No Data'
            })  
         })
         .catch(err => {
            res.status(500).json({
                error : err
            })
         })
}


exports.orders_create_order = (req, res, next) => {
    //Checking Product Id is Matching With Order Product Id
    Product.findById({ _id : req.body.productId })
           .then(product => {
               //Order Post Api Start
                if(!product) {
                   res.status(404).json({
                       message: 'Product Not Found'
                   }) 
                }
                const order = new Order({
                    _id : mongoose.Types.ObjectId(), 
                    product: req.body.productId,
                    quantity: req.body.quantity
                });
            
                return order.save()  
                //  Order Post Api End             
           })
           .then(result => {
            console.log(result); 
            res.status(201).json({
                message: 'Orders Post Request',
                createdOrder: {
                    _id : result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
            // res.status(201).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        })
}



exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById({ _id : id})
         .populate('product')
         .exec()
         .then(doc => {
           if (doc) 
           res.status(201).json({
            _id : doc._id,
            product : doc.product,
            quantity : doc.quantity
           })
           res.status(404).json({
               message : 'Data Not In Database'
           })
         })
         .catch(err => {
             res.status(500).json({
                error : err 
             })
         })
}


exports.orders_delete_order = (req, res, next) => {
    const deleteId = req.params.orderId;
    Order.deleteOne({ _id : deleteId })
         .exec()
         .then(result => {
             res.status(201).json({
                 message : 'Order Id Deleted : ' + deleteId
             })
         })
         .catch(err => {
             res.status(500).json({
                 error : err
             })
         })
  }