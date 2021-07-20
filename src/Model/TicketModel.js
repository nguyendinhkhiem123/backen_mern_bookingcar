const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const ticketModel = new Schema({
    // _id : {type : Number},
    thoigiandat : { type : Date , default : null},
    soghe : { type : Number , require : true },
    trangthaighe : {
        type : String,
        enum : ["ACTIVE", 'PENDING' , "COMPLETE"],
        default : "ACTIVE"
    },
    nguoinhan : { type :  String , default : ''},
    sdt : { type : String , default : ''},
    trip : {
        type : Schema.Types.ObjectId,
        ref : 'trips'
    },
    user :{
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
    pay : {
        type : Schema.Types.ObjectId,
        ref : 'pays'
    }
}, 
{   
    
    timestamps : true
})

module.exports = mongoose.model('tickets' , ticketModel); 