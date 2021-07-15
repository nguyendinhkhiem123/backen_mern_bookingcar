const express = require('express');
const route = express.Router();

const tripController = require('../src/Controller/TripController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, tripController.insertTrip);
route.get('/getall' , tripController.getAllTrip);
route.get('/getonetrip' , tripController.getOneTrip);
route.get('/gettwotrip' , tripController.getTwoTrip);
module.exports = route;