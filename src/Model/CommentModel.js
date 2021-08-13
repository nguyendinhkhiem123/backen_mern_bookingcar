const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const commentModel = new Schema({
    // _id : {type : Number},
    hovaten : { type : String , require : true},
    mota : { type : String , require : true},
    trangthai : { type : Boolean , default : true},

},  
{   
    // _id :false,
    timestamps : true
});

module.exports = mongoose.model('comments' , commentModel); 