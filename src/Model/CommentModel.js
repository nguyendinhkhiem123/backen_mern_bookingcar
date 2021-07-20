const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const commentModel = new Schema({
    // _id : {type : Number},
    mota : { type : String , require : true},
    sosao : { type : Number , default : 5},
    user :{
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
}, 
{   
    // _id :false,
    timestamps : true
});

module.exports = mongoose.model('comments' , commentModel); 