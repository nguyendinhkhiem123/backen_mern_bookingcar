const express = require('express');
const route = express.Router();

const Controller = require('../src/Controller/StatisticalController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.get('/money',verifyToken, Controller.Money);
route.get('/trip',verifyToken, Controller.Trip);
route.get('/car',verifyToken, Controller.Car);
//route.get('/getall' , tripController.getAllTrip);
//route.get('/getonetrip' , tripController.getOneTrip);

module.exports = route
