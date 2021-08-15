const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const employeeModel = new Schema({
    // _id : {type : Number},
    hovaten : { type : String , default: ''},
    diachi : { type : String , default : ''},
    email : { type : String , require : true },
    sdt : { type : String , require : true  },
    ngaysinh : { type : Date  , require : true},
    hinhanh : { type : String , default : ''},
    trangthai : { type : Boolean , default : true},
    account : {
      type : Schema.Types.ObjectId,
      ref : 'accounts'
    }
}, 
{   
    // _id :false,
    timestamps : true
})


module.exports = mongoose.model('employees' , employeeModel);