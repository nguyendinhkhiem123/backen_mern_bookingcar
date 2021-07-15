const carModel = require('../Model/CarModel');
const userModel = require('../Model/UserModel');

const insertCar = async(req , res)=>{
    try{
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        console.log(user.vaitro);
        if(user.vaitro !== 'admin') return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền đến thêm"
        })
        const car = await carModel.findOne({biensoxe :  req.body.biensoxe}) 
        if(car) return res.status(200).json({
            success : false ,
            messgae : "Biển số xe bị trùng vui lòng xem lại"
        })
        const newCar = new carModel(req.body);
        await newCar.save()
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : {
                newCar
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

// const updateRoute = async(req , res)=>{
//     try{
//         const user = await userModel.findOne({manhanvien: req.body.user_id});
//         if(user.vaitro !== 'admin') return res.status(200).json({
//             success : false ,
//             messgae : "Bạn không có quyền đến thêm"
//         })

//         const route = await routeModel.findOneAndUpdate({manhanvien: req.body.id } , req.body);

//         return res.status(200).json({
//             success : true ,
//             message : 'Cập nhật thành công',
//             body : {
//                 route,
//                 user
//              }
//         }); 

//     }
//     catch(err){
//         console.log(err);
//         return res.status(400).json({
//             success : false ,
//             message : 'Lấy thông tin lỗi',
           
//         })
//     }
// }

module.exports = {
   insertCar
}