const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountModel = new Schema({
     
   _id :  { type : String} ,
   matkhau : { type : String   , require : true  },
   role : {
        type : Schema.Types.ObjectId,
        ref : 'roles'
   },
   
}, 
{   
    _id :false,
    timestamps : true
})

module.exports = mongoose.model('accounts' , accountModel);
   
   
   
   
   
  