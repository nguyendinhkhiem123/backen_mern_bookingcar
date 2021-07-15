const routeModel = require('../Model/RouteModel');
const userModel = require('../Model/UserModel');
const getAllRoute =  async(req , res)=>{

    try{
        const allRoute = await routeModel.find({});

        return res.status(200).json({
            success : true ,
            message : 'Lấy thông tin thành công',
            body : allRoute
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const insertRoute = async(req , res)=>{
    try{
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        console.log(user.vaitro);
        if(user.vaitro !== 'admin') return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền đến thêm"
        })
        
        const routeKey =  await routeModel.findOne({matuyen : req.body.matuyen});
        if(routeKey) return res.status(200).json({
            success : false ,
            messgae : `Mã Tuyến đã tồn tại`
        })
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden })
        if(route) return res.status(200).json({
            success : false ,
            messgae : `Tuyến đường từ ${req.body.noidi} đến ${req.body.noiden} đã có !.`
        })
        const body = {
            matuyen :  req.body.matuyen,
            noidi : req.body.noidi ,
            noiden : req.body.noiden ,
            quangduong : req.body.quangduong,
            giave : req.body.giave,
            hinhanh : req.body.hinhanh || '',
            thoigian : req.body.thoigian
        }

        const newRoute = new routeModel(body);
        await newRoute.save();

        const bodyReverse = {
            matuyen :  req.body.matuyen,
            noidi : req.body.noiden ,
            noiden : req.body.noidi ,
            quangduong : req.body.quangduong,
            giave : req.body.giave,
            hinhanh : req.body.hinhanh || ''
        }
        const newRouteReverse =  new routeModel(bodyReverse)
        await newRouteReverse.save();

        return res.status(200).json({
            success : true ,
            message : `Thêm tuyến đường ${req.body.noidi} và ${req.body.noiden} thành công. Hệ thống đã tự thêm tuyến đường ngược lại`,
            body : {
                newRoute,
                user
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

const updateRoute = async(req , res)=>{
    try{
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        if(user.vaitro !== 'admin') return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền đến thêm"
        })

        const route = await routeModel.findOneAndUpdate({_id: req.body.id } , req.body);

        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : {
                route,
                user
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
    getAllRoute , 
    insertRoute ,
    updateRoute
}