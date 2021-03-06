

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const employeeModel = require('../Model/NewModel/EmployeeModel');
const accountModel = require('../Model/NewModel/AccountModel');
const customerModel = require('../Model/NewModel/CustomerModel');
const RoleModel = require('../Model/NewModel/RoleModel');

/*
    method : POST
    url : /auth/login

*/
const login = async ( req , res )=>{
    try{
        
        const account =  await accountModel.findOne({_id : req.body.taikhoan}).populate('role');
        console.log(account);

        if(!account) return res.json({
            success : false ,
            message : ' Sai tài khoản không tồn tại '
        }); 

        

        const confirmPassword = await argon2.verify(account.matkhau,req.body.matkhau);

        if(!confirmPassword) return res.json({
            success : false ,
            message : ' Mật khẩu không đúng '
        }); 

        let ma = null ;

        if(account.role._id !== 0){
            const employee = await employeeModel.findOne({ account : account._id});
            if(employee.trangthai === true) ma = employee._id
            else {
                return res.status(200).json({
                    success : false,
                    message : 'Tài khoản không thể đăng nhập. Nhân viên đã nghỉ'
                })
            }
        }
        else{
            const customer = await customerModel.findOne({ account : account._id});  
            ma = customer._id
        }

        const tokenAccess = jwt.sign({
            user_id :  ma,
            vaitro : account.role._id
        }, 
            process.env.TOKEN_ACCESS_KEY,
            { expiresIn: '30d' }
        );
        const tokenRefresh = jwt.sign({
            user_id :  ma,
            vaitro : account.role._id
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
                vaitro : account.role._id

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

const createUser = async ( req , res ) =>{  
   
    try{

        const email = await customerModel.findOne({email : req.body.email.trim()});
        if(email){
            return res.status(200).json({
                success : false ,
                message : 'Email đã bị trùng . Vui lòng xem lại'
            });   
        }
        const sdt = await customerModel.findOne({sdt : req.body.sdt.trim()});
        if(sdt){
            return res.status(200).json({
                success : false ,
                message : 'Số điện thoại bị trùng. Vui lòng xem lại'
            });   
        }
        const account = await accountModel.findOne({ _id : req.body.taikhoan});     
        if(account) return res.status(200).json({
            success : false ,
            message : 'Username đã bị trùng vui lòng thử lại '
        }); 
        const role = await RoleModel.findOne({_id : 0});
        const matkhau1 = await argon2.hash(req.body.matkhau);

        const newAccount = new accountModel({
            _id : req.body.taikhoan,
            matkhau :  matkhau1,
            role : role._id,
        })
        await newAccount.save();

        const body = {
            hovaten : req.body.hovaten,
            diachi :  req.body.diachi,
            email : req.body.email.trim(),
            sdt : req.body.sdt.trim(),
            ngaysinh : req.body.ngaysinh,
            hinhanh : req.body.hinhanh,
            account : newAccount._id
            
        }

        const customer = new customerModel(body);

        await customer.save();
        return res.status(200).json({
            success : true ,
            message : 'Tạo tài khoảng thành công  ',
            body : customer

        }); 
    }
    catch(err){
        console.log(err);
        return res.status(400)

    }

}


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

const adminCreateAccount = async(req, res)=>{
    try{
        console.log(req.body);
        const account = await accountModel.findOne({ _id : req.body.taikhoan})       
        if(account) return res.status(200).json({
            success : false ,
            message : 'Username đã bị trùng vui lòng thử lại '
        }); 
        const role = await RoleModel.findOne({_id : 1});
        const matkhau1 = await argon2.hash(req.body.matkhau);

        const newAccount = new accountModel({
            _id : req.body.taikhoan,
            matkhau :  matkhau1,
            role : role._id,
        })
        await newAccount.save();

        await employeeModel.findOneAndUpdate({_id : req.body.nhanvien} , {
            account : newAccount._id
        });
        return res.status(200).json({
            success:true,
            message : 'Tạo tài khoản thành công'
        })
    }catch(err){
        console.log(err);
        return res.status(200).json({
            success :false,
            message : 'Lỗi hệ thống'
        })
    }
}
module.exports = {
    login ,
    createUser ,
    token,
    adminCreateAccount
    // createEmployee
    
}