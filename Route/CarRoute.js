const express = require('express');
const route = express.Router();

const carController = require('../src/Controller/CarController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, carController.insertCar);
module.exports = route;