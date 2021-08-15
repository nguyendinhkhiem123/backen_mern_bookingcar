const express = require('express');
const route = express.Router();

const Controller = require('../src/Controller/VoteController'); 
const verifyToken = require('../src/Middleware/AuthenToken');

route.get('/getvote',verifyToken, Controller.getVote);
route.get('/getstatic',verifyToken,Controller.getStatic);
route.post('/insert',verifyToken, Controller.insertVote);
route.post('/delete',verifyToken, Controller.deleteVote);


module.exports = route