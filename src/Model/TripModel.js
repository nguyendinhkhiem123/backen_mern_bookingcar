const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const tripModel = new Schema({
    // _id : {type : Number},
    machuyen : { type : Number ,  unique : true  , require : true},
    ngaydi : { type : Date , require :  true },
    giodi : { type : Number ,  require : true},
    giave : { type : Number , require :  true},
    route :{
        type : Schema.Types.ObjectId,
        ref : 'routes'
    },
    car :{
        type : Schema.Types.ObjectId,
        ref : 'cars'
    },
    // driver :{
    //     type : Schema.Types.ObjectId,
    //     ref : 'drivers'
    // },
    
}, 
{   
    // _id :false,
    timestamps : true
})

tripModel.plugin(AutoIncrement 
    , {inc_field : 'machuyen'}
);
module.exports = mongoose.model('trips' , tripModel); 