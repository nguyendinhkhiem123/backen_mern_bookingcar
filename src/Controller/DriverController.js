const driverModel = require('../Model/DriverModel');
const userModel = require('../Model/UserModel');

const insertDriver = async(req , res)=>{
    try{
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        console.log(user.vaitro);
        if(user.vaitro !== 'admin') return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền đến thêm"
        })
      
        const newDriver = new driverModel(req.body);
        await newDriver.save()
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : {
                newDriver
             }
        }); 
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

module.exports = {
    insertDriver
 }