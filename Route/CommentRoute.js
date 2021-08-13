const express = require('express');
const route = express.Router();

const Controller = require('../src/Controller/CmtController'); 


route.get('/comment', Controller.getComment);
route.get('/reply',Controller.getReply);
route.post('/insertcomment', Controller.insertComment);
route.post('/insertreply', Controller.insertReply);
route.post('/deletecomment', Controller.deleteComment);
route.post('/deletereply', Controller.deleteReply);
//route.get('/getall' , tripController.getAllTrip);
//route.get('/getonetrip' , tripController.getOneTrip);

module.exports = route