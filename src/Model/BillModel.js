const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const billModel = new Schema({
    // _id : {type : Number},
    // ngaythanhtoan : { type : Date , default : null},
    // loaive : { type : String  , default : "MỘT CHIỀU"},
    // soluongve : { type : Number , require : true},
    // hinhthuc: { type : String  , enum : ["OFFLINE" , "ONLINE"] },
    // trangthai : { type : Boolean , default : false}, 

    payid : { type : String  , default : " "}
}, 
{   
    // _id :false,
    timestamps : true
})


module.exports = mongoose.model('bills' , billModel)