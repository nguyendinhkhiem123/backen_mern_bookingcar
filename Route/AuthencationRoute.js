const express = require('express');
const route = express.Router();

const authencationController = require('./../src/Controller/AutheController'); 

// đăng nhập 
route.post('/login' , authencationController.login)

// Tạo tài khoản 
route.post('/create' , authencationController.createUser);

route.post('/createemployee' , authencationController.createEmployee)

// Lấy lại access token bằng refresh token 
route.post('/token' , authencationController.token) 

module.exports = route;

