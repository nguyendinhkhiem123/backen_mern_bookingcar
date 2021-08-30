const express = require('express');
const route = express.Router();

const carController = require('../src/Controller/CarController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.post('/insert',verifyToken, carController.insertCar);

route.get('/getall',verifyToken, carController.getAllCar);
route.post('/changestatus',verifyToken, carController.changeStatus);
route.post('/updatecar',verifyToken, carController.updateCar);
route.post('/deletecar',verifyToken, carController.deleteCar);
module.exports = route;

