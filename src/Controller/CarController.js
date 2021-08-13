const carModel = require('../Model/CarModel');
const insertCar = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;  
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền thêm"
        })
        const car = await carModel.findOne({biensoxe :  req.body.biensoxe}) 
        if(car) return res.status(200).json({
            success : false ,
            message : "Biển số xe bị trùng vui lòng xem lại"
        })
        const newCar = new carModel(req.body);
        await newCar.save()

        const carOne = await carModel.findOne({_id : newCar._id}).populate('route');
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : {
                carOne
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

const getAllCar = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;

     
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })
        const car = await carModel.find({})
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
            body : {
                car
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
const changeStatus = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;

     
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })
        const car = await carModel.findOneAndUpdate({_id : req.body.id} , {
            trangthai : req.body.trangthai
        })
        return res.status(200).json({
            success : true ,
            message : 'Sửa thành công',
         
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
const updateCar = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })

        const car = await carModel.findOne({_id : req.body.id});
        if(car.biensoxe !== req.body.biensoxe){
            const carSo = await carModel.findOne({biensoxe :  req.body.biensoxe}) 
            if(carSo) return res.status(200).json({
                success : false ,
                message : "Biển số xe bị trùng vui lòng xem lại"
            })
        }

        const carUpdate = await carModel.findOneAndUpdate({_id : req.body.id} , {
            trangthai  : req.body.trangthai,
            biensoxe  : req.body.biensoxe ,
            soluongghe  : req.body.soluongghe,
            route : req.body.route
        })
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công',
         
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
   insertCar,
   getAllCar,
   changeStatus,
   updateCar
}