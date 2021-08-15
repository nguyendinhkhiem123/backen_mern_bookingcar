const express = require('express');
const route = express.Router();

const userController = require('./../src/Controller/UserController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.get('/getone' ,verifyToken,userController.getUser);
route.post('/update' ,verifyToken,userController.updateUser);
route.get('/getemployee' ,verifyToken,userController.getEmployee);
route.post('/updatestatusemployee' ,verifyToken,userController.updateStatusEmployee);
route.post('/changepassword' ,verifyToken,userController.changePassword);
route.post('/forgotpassword' ,userController.forgotPassword);
route.post('/updateemployee' ,verifyToken,userController.updateEmployee);
route.post('/insertemployee' ,verifyToken,userController.insertEmployee);
module.exports = route;


