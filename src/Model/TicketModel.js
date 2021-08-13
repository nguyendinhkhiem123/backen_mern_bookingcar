const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const ticketModel = new Schema({
    // _id : {type : Number},
    thoigiandat : { type : Date , default : null},
    soghe : { type : Number , require : true },
    hovaten : { type : String , default : ""},
    sdt : { type : String , default : ""},
    email : { type : String , default : ""},
    hinhthucthanhtoan : { type : String , enum : ["OFFLINE" , "ONLINE" , ""] , default : ""},
    trangthaithanhtoan : { type : Boolean , default : false},
    trangthaive : {
        type : String,
        enum : ["DAHUY", 'DANGUUTIEN' , "DADAT"],
        default : "DANGUUTIEN"
    },
    ngayhuy : { type : Date , default : null},
    tienphat : { type : Number , default : 0},
    trip : {
        type : Schema.Types.ObjectId,
        ref : 'trips'
    },
    customer :{
        type : Schema.Types.ObjectId,
        ref : 'customers'
    }
}, 
{   
    
    timestamps : true
})

module.exports = mongoose.model('tickets' , ticketModel); 