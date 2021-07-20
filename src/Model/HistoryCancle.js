const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const cancleModel = new Schema({
    // _id : {type : Number},
    ngayhuy : { type : Date , unique : true  },
    chuyenhuy : {type : String , require : true },
    soghehuy : { type : Number , require : true },
    pay :{
        type : Schema.Types.ObjectId,
        ref : 'pays'
    }
}, 
{   
    // _id :false,
    timestamps : true
})


module.exports = mongoose.model('cancles' , cancleModel)