const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const roleModel = new Schema({
    // tenquyen : { type : Number , unquine : true , require : true},  // 0 user , 1 nhanvien , 2 admin
    _id : { type :  Number },
    mota : { type : String  , require : true}
}, 
{   
    _id :false,
    timestamps : true
})

module.exports = mongoose.model('roles' , roleModel);
   
   
   
   