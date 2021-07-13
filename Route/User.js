const express = require('express');
const route = express.Router();

const userController = require('./../src/Controller/UserController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.get('/getone' ,verifyToken,userController.getUser);
route.post('/update' ,verifyToken,userController.updateUser);
route.post('/changepassword' ,verifyToken,userController.changePassword);
route.post('/forgotpassword' ,userController.forgotPassword);
module.exports = route;