const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const accountModel = new Schema({
     
   taikhoan : { type : String  , unique : true , require : true } ,
   matkhau : { type : String   , require : true  },
   role : {
        type : Schema.Types.ObjectId,
        ref : 'roles'
   }
}, 
{   
    // _id :false,
    timestamps : true
})

module.exports = mongoose.model('accounts' , accountModel);
   
   
   
   
   
  