const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const voteModel = new Schema({
    // _id : {type : Number},
  
    mota : { type : String , require : true},
    sosao : { type : Number , require : true},
    trangthai : { type : Boolean , default : true},
    customer :{
        type : Schema.Types.ObjectId,
        ref : 'customers'
    }
},  
{   
    // _id :false,
    timestamps : true
});

module.exports = mongoose.model('votes' , voteModel); 