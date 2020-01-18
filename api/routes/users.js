 const express = require('express');
 const router = express.Router();
 const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

 const User = require('../models/user');

 router.post('/signup', (req, res) => {
    User.find({ email : req.body.email })
        // .toArray()
        .exec()
        .then(user => {
           if (user.length >= 1) {
               console.log(user);
               console.log(user[0].email);
            //    var em = user.filter(function(e) {
            //        return e.email
            //    })
               res.status(422).json({
                //    email: user.email,
                   
                   message : user[0].email+' Already Exists'
               })
           } else {
               bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id : new mongoose.Types.ObjectId,
                            email : req.body.email,
                            password : hash
                        });
            
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User Created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error : err
                                })
                            })
                    }
                });
           }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error : err
            })
        })
 });



router.post('/login', (req, res, next) => {
   User.find({ email : req.body.email })
       .exec()
       .then(user => {
           if (user.length < 1) {
              console.log(user);
              res.status(401).json({
                message: 'Auth Fail'
              });
           } else {
              console.log(user);
              bcrypt.compare(req.body.password, user[0].password, (err, result ) => {
                 if (err) {
                    res.status(401).json({
                        message: 'Auth Fail'
                      }); 
                 } 

                 if (result) {
                    
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                      expiresIn: "1h"  
                    } 
                    );

                    return res.status(200).json({
                        message: 'Auth Successfull',
                        token: token
                    }) ;
                 }

                 return res.status(401).json({
                    message: 'Auth Fail'
                 }) ;
              });
           }
       })
       .catch(err => {
           res.status(500).json({
               error : err
           })
       })
});


 router.delete('/:userId', (req, res, next) => {
     deleteId = req.params.userId;
     User.deleteOne({ _id : deleteId})
         .exec()
         .then(result => {
             res.status(200).json({
                 message: 'User Deleted'
             })
         })
         .catch(err => {
             res.status(500).json({
                 error: err
             })
         })
 });


 module.exports = router;