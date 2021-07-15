const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const userModel = new Schema({
    // _id : {type : Number},
    manhanvien : { type : Number ,  unique : true  , require : true},
    taikhoan : { type : String  , unique : true , require : true } ,
    matkhau : { type : String   , require : true  },
    hovaten : { type : String , default: ''},
    diachi : { type : String , default : ''},
    email : { type : String , require : true },
    sdt : { type : String , require : true  },
    ngaysinh : { type : Date  , defaule : Date.now},
    hinhanh : { type : String , default : ''},
    vaitro : {
        type : String ,
        require : true ,    
    }
}, 
{   
    // _id :false,
    timestamps : true
})

userModel.plugin(AutoIncrement 
    , {inc_field : 'manhanvien'}
    );
module.exports = mongoose.model('users' , userModel); 