const userModel = require('../Model/UserModel');
const argon2 = require('argon2');
const mailer = require('../../Service/Mailer');
const getUser = (async (req, res) =>{
    const id = req.body.user_id;
    const user = await userModel.findOne({manhanvien : id})
    return res.status(200).json({
        success : true ,
        messgae : 'Lấy thông tin thành công',
        body : user
    })
})
const updateUser = ( async (req , res) =>{
    try{
        const id = req.body.user_id;
    
        const user = await userModel.findOneAndUpdate({manhanvien : id} ,req.body)
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : user
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            err 
        })
    } 
})

const changePassword = ( async (req , res)=>{
    try{
        const id = req.body.user_id;
        const user = await userModel.findOne({manhanvien : id})

        const confirmPassword = await argon2.verify(user.matkhau ,req.body.matkhaucu);
        if(!confirmPassword) return res.status(200).json({
            success : false ,
            message : 'Mật khẩu cũ không đúng !. Vui lòng thử lại',
        })
        const matkhaumoi = await argon2.hash(req.body.matkhaumoi)
        await userModel
        .findOneAndUpdate({
            manhanvien : id
        }, 
        { 
            matkhau : matkhaumoi
        });
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : user
        })
    }
    catch(err){
        res.status(400).json({
            err : err.messgae
        })
    } 
})
const forgotPassword =  (async( req , res)=>{
    try{
        const user = await userModel.findOne({ taikhoan : req.body.taikhoan })
        
        if(!user) return res.json({
            success : false ,
            message : ' Sai tài khoản không tồn tại '
        }); 
        const randomPassword = Math.floor(Math.random() * 1000000) + 100000;
        const hashPassword = await argon2.hash(randomPassword.toString());
        console.log(randomPassword , hashPassword)
        await userModel.findOneAndUpdate({manhanvien : user._id} , { matkhau : hashPassword });

        const mailOptions = {
            from: user.email,
            to: user.email,
            subject: 'Nhà xe NDK thông báo',
            text: `Mật khẩu mới của bạn là ${randomPassword}`
          };
        mailer.sendMail(mailOptions ,function(error, info){
            if (error) {
              console.log(error);
            } else {
                return res.status(200).json({
                    success  : true ,
                    message : `Mật khẩu đã được gửi tới ${user.email}. Vui lòng check lại `
                })
                console.log('Email sent: ' + info.response);
                
            
            };
        
        })
      
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            
        })
    }
})
module.exports = {
    getUser,
    updateUser,
    changePassword,
    forgotPassword
}