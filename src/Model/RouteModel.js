const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const routeModel = new Schema({
    matuyen : { type : Number ,  unique : true  , require : true},
    noidi : { type : String  , require : true } ,
    noiden : { type : String   , require : true  },
    quangduong : { type : Number , default : 0},
    thoigian : { type : Number , require : true},
    giave : { type : Number , require :  true},
    hinhanh : {type : String , defualt : ''}
  
}, 
{   
   
    timestamps : true
})

routeModel.plugin(AutoIncrement , {inc_field : 'matuyen' ,disable_hooks : false });
module.exports = mongoose.model('routes' , routeModel); 