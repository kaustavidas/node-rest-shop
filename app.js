const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:' + process.env.MONGO_ATLAS_PASSWORD + '@node-rest-shop-hdag0.mongodb.net/test?retryWrites=true&w=majority',
                 { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

mongoose.Promise = global.Promise;

// Middleware
// Morgan Use For to See App Log (Means App Calling Stats) in Terminal
app.use(morgan('dev'));
//Using express.static for public access to upload folder & /upload for url
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//CORS SETUP 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
      return res.status(200).json({});
    }
    next();
})


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRouts = require('./api/routes/users');


// Routes Which Should handle Request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRouts);


// Error Handling Middleware For Not Finding API
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error Handling Middleware For Other Error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;