const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const routeModel = new Schema({
    matuyen : { type : String , require : true},
    noidi : { type : String  , require : true } ,
    noiden : { type : String   , require : true  },
    quangduong : { type : Number , require : true , min : 1},
    thoigian : { type : Number , require : true , min : 1},
    hinhanh : {type : String , defualt : ''},
    trangthai : { type : Boolean , default : true}
}, 
{   
    timestamps : true
})

// routeModel.plugin(AutoIncrement , {inc_field : 'matuyen' });
routeModel.index({ noidi: 1, noiden : 1}, { unique: true , require : true });
module.exports = mongoose.model('routes' , routeModel);