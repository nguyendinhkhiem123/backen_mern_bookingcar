const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const ticketModel = new Schema({
    // _id : {type : Number},
    thoigiandat : { type : Date , default : null},
    soghe : { type : Number , require : true },
    nguoinhan : { type :  String , default : ''},
    sdt : { type : String , default : ''},
    hinhthuc : {
        type : String,
        enum : ['OFFLINE' , 'ONLINE'],
        default : 'OFFLINE'
    },
    thanhtoan : { 
        type : Boolean,
        defult : false
    },
    trip : {
        type : Schema.Types.ObjectId,
        ref : 'trips'
    },
    user :{
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
}, 
{   
    
    timestamps : true
})

module.exports = mongoose.model('tickets' , ticketModel); 