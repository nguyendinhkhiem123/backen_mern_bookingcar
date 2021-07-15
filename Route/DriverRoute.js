const express = require('express');
const route = express.Router();

const driverController = require('../src/Controller/DriverController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, driverController.insertDriver);

module.exports = route;