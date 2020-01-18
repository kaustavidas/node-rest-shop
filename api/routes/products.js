const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

// const Product = require('../models/product');

//Product Controller
const productController = require('../controllers/products');

// multer DiskStorage Stratagy
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads');
   },
   filename: function (req, file, cb) {
     cb(null, Date.now() + file.originalname); 
   }
});

const fileFilter = (req, file, cb) => {
  //Reject A File
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Multer Config
const upload = multer({ 
   storage : storage, 
   limits : {
       fileSize : 1024 * 1024 * 5
   },
   fileFilter: fileFilter
});



//Routes API
router.get('/', productController.products_get_all);

router.post('/' , checkAuth, upload.single('productImage') , productController.products_create_product);

router.get('/:productId', productController.products_get_product);

router.patch('/:productId', checkAuth, productController.products_update_product);

router.delete('/:productId', checkAuth, productController.products_delete_product);


module.exports = router;