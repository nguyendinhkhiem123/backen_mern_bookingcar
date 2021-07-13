const mongoose = require('mongoose');

function connect(){
    try{
        mongoose.connect('mongodb://localhost:27017/booking_ticket_car', {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex : true , useFindAndModify : false});
        console.log('Kết nối thành công')
    }catch(err){
        console.log('Kết nối thất bại');
    }
}


module.exports =  { connect }