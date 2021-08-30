const express = require('express');
const route = express.Router();

const routeController = require('./../src/Controller/RouteController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.get('/getallroute' ,routeController.getAllRoute)
route.post('/insertroute' ,verifyToken,routeController.insertRoute)
route.post('/updateroute' ,verifyToken,routeController.updateRoute) 
route.post('/changestatus' ,verifyToken,routeController.changeStatus) 
route.post('/deleteroute' ,verifyToken,routeController.deleteRoute) 
route.post('/checkroute' ,verifyToken,routeController.checkRoute) 
module.exports = route;
