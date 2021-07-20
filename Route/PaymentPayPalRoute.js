const express = require('express');
const route = express.Router();

const paymentController = require('../src/Controller/PaymentPayPalController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/payment' ,paymentController.payPayal)
route.get('/success' ,paymentController.paySuccess)
route.get('/erorr' ,paymentController.payErorr) 

module.exports = route;