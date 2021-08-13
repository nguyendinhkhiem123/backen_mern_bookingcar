const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const tripModel = new Schema({

    machuyen : { type : Number ,  unique : true  , require : true},
    ngaydi : { type : Date , require :  true },
    giodi : { type : Number ,  require : true},
    giave : { type : Number , require :  true},
    soluongve : { type : Number , require :  true},
    trangthai : { type : String ,
        enum : ["HOANTHANH" , "DAHUY" , "DANGDOI" , "DANGKHOIHANH"],
        default :  'DANGDOI'
    },
    ngayhoanthanh :  { type : Date , require :  true },
    giohoanthanh : { type : Number , require : true},
    route :{
        type : Schema.Types.ObjectId,
        ref : 'routes'
    },
    car :{
        type : Schema.Types.ObjectId,
        ref : 'cars'
    },

}, 
{   
    // _id :false,
    timestamps : true
})

tripModel.plugin(AutoIncrement 
    , {inc_field : 'machuyen'}
);
module.exports = mongoose.model('trips' , tripModel); 