const userModel = require('../Model/UserModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
/*
    method : POST
    url : /auth/login

*/
const login = async ( req , res )=>{
    try{
        const user = await userModel.findOne({ taikhoan : req.body.taikhoan })
        
        if(!user) return res.json({
            success : false ,
            message : ' Sai tài khoản không tồn tại '
        }); 
        const confirmPassword = await argon2.verify(user.matkhau,req.body.matkhau);
        if(!confirmPassword) return res.json({
            success : false ,
            message : ' Mật khẩu không đúng '
        }); 

        const tokenAccess = jwt.sign({
            user_id :  user.manhanvien
        }, 
            process.env.TOKEN_ACCESS_KEY,
            { expiresIn: '30d' }
        );
        const tokenRefresh = jwt.sign({
            user_id :  user.manhanvien
        }, 
            process.env.TOKEN_REFRESH_KEY,
            { expiresIn: '90d' }
        )

        return res.status(200).json({
            success : true ,
            message : 'Đăng nhập thành công',
            body : {
                tokenAccess ,
                tokenRefresh,
                vaitro :user.vaitro

            }
        }) 
    }   
    catch(err){ 
        console.log(err);
        res.status(500).json({
            success : false ,
            message : 'Đăng nhập thất bại',
           
        }) 
    }
}


/*
    method : POST
    url : /auth/create
    body : username , password , name , role
*/

const create = async ( req , res ) =>{  
   
    try{

        const user = await userModel.findOne({ taikhoan : req.body.taikhoan })       
        if(user) return res.status(200).json({
            success : false ,
            message : 'Username đã bị trùng vui lòng thử lại '
        }); 
        
        const matkhau1 = await argon2.hash(req.body.matkhau)
        const body = {
            taikhoan : req.body.taikhoan,
            matkhau  : matkhau1,
            hovaten : req.body.hovaten,
            diachi :  req.body.diachi,
            email : req.body.email,
            sdt : req.body.sdt,
            ngaysinh : req.body.ngaysinh,
            hinhanh : req.body.hinhanh,
            vaitro : req.body.vaitro  
        }
        const usermodel = new userModel(body);

        await usermodel.save();
        return res.status(200).json({
            success : true ,
            message : 'Tạo tài khoảng thành công  ',
            body : usermodel

        }); 
    }
    catch(err){
        console.log(err);
        return res.status(400)

    }

}


/*
    method : POST 
    url : /auth/token 
    body : accessToken 
*/

const token = async ( req , res ) =>{
    const refreshToken =  req.body.refreshToken
    if(!refreshToken) return res.status(403).json({success : false  , message : "Refresh token không tồn tại"})

    try{
        const payload = await jwt.verify(refreshToken , process.env.TOKEN_REFRESH_KEY);
        
        const tokenAccess = await jwt.sign({user_id : payload.user_id} ,
            process.env.TOKEN_ACCESS_KEY,
            { expiresIn: '30d' })

        return res.status(200).json({
            success : true ,
            message : 'Tạo token thành công',
            body : {
                tokenAccess
            }
            
        })
    }
    catch(err)
    {
        return res.sendStatus(400)
    }
}

module.exports = {
    login ,
    create ,
    token
}