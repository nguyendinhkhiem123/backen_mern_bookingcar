const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const customerModel = new Schema({
    // _id : {type : Number},
    hovaten : { type : String , default: ''},
    diachi : { type : String , default : ''},
    email : { type : String , require : true },
    sdt : { type : String , require : true  },
    ngaysinh : { type : Date  , defaule : Date.now},
    hinhanh : { type : String , default : ''},
    account : {
      type : Schema.Types.ObjectId,
      ref : 'accounts'
    }
}, 
{   
    // _id :false,
    timestamps : true
})
module.exports = mongoose.model('customers' , customerModel);