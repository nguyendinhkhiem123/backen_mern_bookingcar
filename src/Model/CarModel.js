const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const carModel = new Schema({
    _id : { type : String},
    // biensoxe : { type : String , unique : true  , require : true},
    soluongghe : {type : Number , require : true  },
    trangthai : { type: Boolean , default : true},
    hinhanh : { type : String  , default : ''},
}, 
{   
    _id : false,
    timestamps : true
})

module.exports = mongoose.model('cars' , carModel)