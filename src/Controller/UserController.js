const userModel = require('../Model/UserModel');
const argon2 = require('argon2');
const mailer = require('../../Service/Mailer');

const employeeModel = require('../Model/NewModel/EmployeeModel');
const customerModel = require('../Model/NewModel/CustomerModel');
const accountModel = require('../Model/NewModel/AccountModel');


const getUser = (async (req, res) =>{
    const vaitro = req.body.vaitro;
    const id = req.body.user_id;

    let body = null;
   
    if(vaitro === 0){
        const customer = await customerModel.findOne({_id : id});
        body = customer
    }
    else{
        const employee = await employeeModel.findOne({_id : id});
        body = employee
    }
  
    return res.status(200).json({
        success : true ,
        messgae : 'Lấy thông tin thành công',
        body : body
    })
})

const updateUser = ( async (req , res) =>{
    try{

        const vaitro = req.body.vaitro;
        const id = req.body.user_id;
        let body;
        if(vaitro === 0){
            const customer = await customerModel.findOneAndUpdate({_id : id } , req.body);
            const findOneCustomer = await customerModel.findOne({_id : id });
            body = findOneCustomer
        }
        else{
            const employee = await employeeModel.findOneAndUpdate({_id : id } , req.body);
            const findOneEmployee = await employeeModel.findOne({_id : id });
            body = findOneEmployee 
        }
    
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : body
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
        const vaitro = req.body.vaitro;
      
        let body = null;

        if(vaitro === 0){
            const findOneCustomer = await customerModel.findOne({_id : id }).populate('account');
            body = findOneCustomer
        }
        else{
            const findOneEmployee = await employeeModel.findOne({_id : id }).populate('account');
            body = findOneEmployee 
        }

        const account =  await accountModel.findOne({_id : body.account._id});
        const confirmPassword = await argon2.verify(account.matkhau ,req.body.matkhaucu);
        if(!confirmPassword) return res.status(200).json({
            success : false ,
            message : 'Mật khẩu cũ không đúng !. Vui lòng thử lại',
        })
        const matkhaumoi = await argon2.hash(req.body.matkhaumoi)
        await accountModel
        .findOneAndUpdate({
            _id : body.account._id
        }, 
        { 
            matkhau : matkhaumoi
        });
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : body
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
        
        const account = await accountModel.findOne({ taikhoan : req.body.taikhoan })
        
        if(!account) return res.json({
            success : false ,
            message : ' Sai tài khoản không tồn tại '
        }); 
        const randomPassword = Math.floor(Math.random() * 1000000) + 100000;
        const hashPassword = await argon2.hash(randomPassword.toString());
        
        console.log(randomPassword , hashPassword)
        await accountModel.findOneAndUpdate({_id : account._id} , { matkhau : hashPassword });
        
        let body = null;
        const customer = await customerModel.findOne({account : account._id});
        if(customer){
            body = customer
            console.log(body)
        }
        else{
            const employee = await employeeModel.findOne({account : account._id});
            body = employee
        }
        const mailOptions = {
            from: body.email,
            to: body.email,
            subject: 'Nhà xe NDK thông báo',
            text: `Mật khẩu mới của bạn là ${randomPassword}`
          };
        mailer.sendMail(mailOptions ,function(error, info){
            if (error) {
                return res.status(200).json({
                    success  : false ,
                    message : `Mật khẩu đã được gửi tới ${body.email}. Vui lòng check lại `
                })
            
            } else {
                return res.status(200).json({
                    success  : true ,
                    message : `Mật khẩu đã được gửi tới ${body.email}. Vui lòng check lại `
                })
            };
        
        })
      
    }
    catch(err){
        console.log(err);
        res.status(200).json({
            success  : false ,
            message : `Lỗi mạng vui lòng xem lại`
        })
    }
})
module.exports = {
    getUser,
    updateUser,
    changePassword,
    forgotPassword
}