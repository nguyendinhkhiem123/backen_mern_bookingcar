const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const payModel = new Schema({
    // _id : {type : Number},
    ngaythanhtoan : { type : Date , default : null},
    loaive : { type : String  , default : "MỘT CHIỀU"},
    chieudi : { type : String , default :  " "},
    sovedi : { type : Number , default : 0},
    chieuve : { type : String , default :  " "},
    soveve  : { type : Number , default : 0},
    giavedi :   { type : Number , default : 0},
    giaveve : { type : Number , default : 0},
    hinhthuc: { type : String  , enum : ["OFFLINE" , "ONLINE"] },
    trangthai : { type : Boolean , default : false}, 
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    }
}, 
{   
    // _id :false,
    timestamps : true
})


module.exports = mongoose.model('pays' , payModel)