const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const driverModel = new Schema({

    hovaten : { type : String , default: ''},
    diachi : { type : String , default : ''},
    email : { type : String , require : true },
    sdt : { type : String , require : true  },
    ngaysinh : { type : Date  , defaule : Date.now},
    hinhanh : { type : String , default : ''},
    trangthai : { 
        type : Boolean, 
        default : true
    },
    cho : {
        type : Number ,
        require : true ,
        enum : [1 , 0]
    },
    route :{
        type : Schema.Types.ObjectId,
        ref : 'routes'
    }
}, 
{   
   
    timestamps : true
})

module.exports = mongoose.model('drivers' , driverModel); 