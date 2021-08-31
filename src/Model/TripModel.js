const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const tripModel = new Schema({

    // machuyen : { type : Number ,  unique : true  , require : true},
    ngaydi : { type : Date , require :  true },
    giodi : { type : Number ,  require : true},
    giave : { type : Number , require :  true},
    // soluongve : { type : Number , require :  true},
    trangthai : { type : String ,
        enum : [ "DAHUY" , "DANGDOI" , "DANGKHOIHANH" ,"HOANTHANH" ],
        default :  'DANGDOI'
    },
    ngayhoanthanh :  { type : Date , require :  true },
    giohoanthanh : { type : Number , require : true},
    route :{
        type : Schema.Types.ObjectId,
        ref : 'routes'
    },
    car :{
        type : Schema.Types.String,
        ref : 'cars'
    },

},
{   
    // _id :false,
    timestamps : true
})

// tripModel.plugin(AutoIncrement 
//     , {inc_field : 'machuyen'}

tripModel.index({ ngaydi: 1, giodi: 1, car : 1 , route :1}, { unique: true , require : true});
module.exports = mongoose.model('trips' , tripModel); 