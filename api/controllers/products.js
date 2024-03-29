const mongoose = require('mongoose');

const Product = require('../models/product');


exports.products_get_all = (req, res, next) => {
    Product.find()
           .select('name price _id productImage')
           .exec()
           .then(docs => {
               //console.log(docs)
               const response = {
                   count: docs.length,
                   products: docs.map(doc => {
                     return {
                           _id  : doc._id,
                           name : doc.name,
                           price : doc.price,
                           productImage: doc.productImage,
                           request: {
                               type: 'GET',
                               url: 'http://localhost:3000/products/' + doc._id
                           }    
                      }
                   })
               };
               if (docs.length >= 0) {
                 res.status(200).json(response)
               } else {
                 res.status(404).json({
                     message: "No Data Found"
                 })
               }
           })
           .catch(err => {
              console.log(err)
              res.status(500).json({
                  error: err
              })
           });
}



exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message : 'Created Product Successfully',
                    //createdProduct : result
                    createdProduct : {
                        _id : result._id,
                        name : result.name,
                        price : result.price,
                        request : {
                            type : 'GET',
                            // description: 'Get All Products',
                            url : 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error : err.message
                })
            });
}


exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
           .select('name price _id productImage')
           .exec()
           .then(doc => {
               console.log(doc);
               //Checking No Data Or Null Collection
               if (doc) {
                res.status(200).json(doc);
               } else {
                res.status(404).json({
                    message: 'Product Id Not Matched With Our Database'
                }) 
               }
           })
           .catch(err => {
               console.log(err);
               res.status(500).json({
                   error : err
               });
           });
}


exports.products_update_product = (req, res, next) => {
    const updateId = req.params.productId;
    
    //Next 4 Line Use for dynamically setting $set update variable
    const updateOps = {};
    for ( const ops of req.body ) {
      updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({ _id : updateId}, 
        { 
            // $set : {
            //         name : req.body.newName,
            //         price: req.body.newPrice
            //        }
            $set : updateOps
        }
    ).exec()
     .then(result => {
        if (result) {
           //console.log(result)
           res.status(200).json({
              message: 'Product Updated',
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products/' + updateId
              } 
           });
        } else {
           res.status(404).json({
               message : "Not Object Id Found"
           })
        }
     })
     .catch(err => {
         console.log(err)
         res.status(500).json({
             error: err
         })
     })
}



exports.products_delete_product = (req, res, next) => {
    const deleteId = req.params.productId;
    Product.deleteOne({ _id: deleteId})
           .exec()
           .then(result => {
             res.status(200).json({
                 message: 'Product Deleted',
                 request: {
                     type: 'POST',
                     url: 'http://localhost:3000/products/',
                     body: { name: 'String', price: 'Number'}
                 }
             })
           })
           .catch(err => {
            console.log(err)
            res.status(500).json({
                error : err
            })
           })
}