const express = require('express');
const route = express.Router();

const ticketController = require('../src/Controller/TicketController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

//route.post('/insert',verifyToken, tripController.insertTrip);
//route.get('/getall' , tripController.getAllTrip);
//route.get('/getonetrip' , tripController.getOneTrip);
route.get('/gettickettrip' ,verifyToken,ticketController.getTicketTrip);
route.get('/checknumberticket' ,verifyToken,ticketController.getNumberTicket);
route.post('/updatestausticket' ,verifyToken,ticketController.updatStatusTicket);
route.post('/checknumbercar' ,verifyToken,ticketController.checkNumberCar);
route.post('/checkupdatenumberticket',verifyToken,ticketController.checkOutNumberCar);
route.get('/getticketofuser',verifyToken,ticketController.getTicketOfUser);
route.post('/cancleticket',verifyToken,ticketController.cancleTicket);
route.post('/insertticket',verifyToken,ticketController.insertTicket);
route.get('/getticketoftrip',verifyToken,ticketController.getTicketOfTrip);
route.post('/getslotcar',verifyToken,ticketController.getSlotCar);
route.post('/insertticketofadmin',verifyToken,ticketController.insertTicketOfAdmin);
route.post('/updateticketofadmin',verifyToken,ticketController.updateTicketOfAdmin);
route.post('/deleteticket',verifyToken,ticketController.deleteTicket);
module.exports = route


