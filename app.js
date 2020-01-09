const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Morgan Use For to See App Log (Means App Calling Stats) in Terminal
app.use(morgan('dev'));


// Routes Which Should handle Request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


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