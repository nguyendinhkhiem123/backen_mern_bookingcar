

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
        
        const account =  await accountModel.findOne({taikhoan : req.body.taikhoan}).populate('role');
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

        if(account.role.tenquyen !== 0){
            const employee = await employeeModel.findOne({ account : account._id});
            ma = employee._id
        }
        else{
            const customer = await customerModel.findOne({ account : account._id});
            ma = customer._id
        }

        const tokenAccess = jwt.sign({
            user_id :  ma,
            vaitro : account.role.tenquyen
        }, 
            process.env.TOKEN_ACCESS_KEY,
            { expiresIn: '30d' }
        );
        const tokenRefresh = jwt.sign({
            user_id :  ma,
            vaitro : account.role.tenquyen
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
                vaitro : account.role.tenquyen

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

        const account = await accountModel.findOne({ taikhoan : req.body.taikhoan })       
        if(account) return res.status(200).json({
            success : false ,
            message : 'Username đã bị trùng vui lòng thử lại '
        }); 
        const role = await RoleModel.findOne({tenquyen : 0});
        const matkhau1 = await argon2.hash(req.body.matkhau);

        const newAccount = new accountModel({
            taikhoan :  req.body.taikhoan,
            matkhau :  matkhau1,
            role : role._id,
        })
        await newAccount.save();

        const body = {
            taikhoan : req.body.taikhoan,
            matkhau  : matkhau1,
            hovaten : req.body.hovaten,
            diachi :  req.body.diachi,
            email : req.body.email,
            sdt : req.body.sdt,
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

const createEmployee = async ( req , res ) =>{  
   
    try{

    
        const account = await accountModel.findOne({ taikhoan : req.body.taikhoan })       
        if(account) return res.status(200).json({
            success : false ,
            message : 'Username đã bị trùng vui lòng thử lại '
        }); 
        const role = await RoleModel.findOne({tenquyen : req.body.tenquyen});
        const matkhau1 = await argon2.hash(req.body.matkhau);
        const newAccount = new accountModel({
            taikhoan :  req.body.taikhoan,
            matkhau :  matkhau1,
            role : role._id,
        })
        await newAccount.save();

        if(role.tenquyen === 0){

            
            const body = {
                taikhoan : req.body.taikhoan,
                matkhau  : matkhau1,
                hovaten : req.body.hovaten,
                diachi :  req.body.diachi,
                email : req.body.email,
                sdt : req.body.sdt,
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
        else{
            const body = {
                taikhoan : req.body.taikhoan,
                matkhau  : matkhau1,
                hovaten : req.body.hovaten,
                diachi :  req.body.diachi,
                email : req.body.email,
                sdt : req.body.sdt,
                ngaysinh : req.body.ngaysinh,
                hinhanh : req.body.hinhanh,
                account : newAccount._id
                
            }
    
            const employee = new employeeModel(body);
    
            await employee.save();
            return res.status(200).json({
                success : true ,
                message : 'Tạo tài khoảng thành công  ',
                body : employee
    
            }); 
        }
      
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
    createUser ,
    token,
    createEmployee
    
}