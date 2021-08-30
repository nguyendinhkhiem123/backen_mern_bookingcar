const express = require('express');
const route = express.Router();

const tripController = require('../src/Controller/TripController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, tripController.insertTrip);
route.get('/getall' ,verifyToken,tripController.getAllTrip);
route.get('/gethourstrip' ,verifyToken, tripController.getHoursTrip);
route.get('/gettickerhourtrip' ,verifyToken,tripController.getTicketHoursTrip);

route.post('/updatestatustrip' ,verifyToken, tripController.updateStausTrip);
route.post('/cancletrip' ,verifyToken,tripController.cancleTrip);
route.post('/getcar' ,verifyToken,tripController.getCarOfTrip);
route.post('/updatetrip' ,verifyToken,tripController.updateTrip);
route.post('/deletetrip' ,verifyToken,tripController.deleteTrip);
module.exports = route;

