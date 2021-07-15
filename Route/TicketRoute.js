const express = require('express');
const route = express.Router();

const ticketController = require('../src/Controller/TicketController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

//route.post('/insert',verifyToken, tripController.insertTrip);
//route.get('/getall' , tripController.getAllTrip);
//route.get('/getonetrip' , tripController.getOneTrip);
route.get('/gettickettrip' , ticketController.getTicketTrip);
route.get('/checknumberticket' , ticketController.getNumberTicket);
module.exports = route