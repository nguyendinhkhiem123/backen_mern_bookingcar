const express = require('express');
const route = express.Router();

const tripController = require('../src/Controller/TripController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, tripController.insertTrip);
route.get('/getall' , tripController.getAllTrip);
route.get('/gethourstrip' , tripController.getHoursTrip);
route.get('/gettickerhourtrip' , tripController.getTicketHoursTrip);

module.exports = route;