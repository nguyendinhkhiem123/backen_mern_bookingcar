const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const replyModel = new Schema({
    // _id : {type : Number},
    hovaten : { type : String , require},
    mota : { type : String , require : true},
    trangthai : { type : Boolean , default : true},
    comment :{
        type : Schema.Types.ObjectId,
        ref : 'comments'
    },
    employee : {
        type : Schema.Types.ObjectId,
        ref : 'employees'
        
    }
},  
{   
    // _id :false,
    timestamps : true
});

module.exports = mongoose.model('replys' , replyModel); 