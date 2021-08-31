
const routeModel = require('../Model/RouteModel');
const tripModel = require('../Model/TripModel');

const getAllRoute=  async(req , res)=>{

    try{
        const allRoute = await routeModel.find({
        });

        return res.status(200).json({
            success : true ,
            message : 'Lấy thông tin thành công',
            body : allRoute
        })
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const insertRoute = async(req , res)=>{
    try{
        const vaitro =  req.body.vaitro
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            message : "Bạn không có quyền đến thêm"
        })
        
        const routeKey =  await routeModel.findOne({matuyen : req.body.matuyen});
        if(routeKey) return res.status(200).json({
            success : false ,
            message : `Mã Tuyến đã tồn tại`
        })
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden })
        if(route) return res.status(200).json({
            success : false ,
            message : `Tuyến đường từ ${req.body.noidi} đến ${req.body.noiden} đã có !.`
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
            thoigian : req.body.thoigian,
            hinhanh : req.body.hinhanh || ''
        }
        const newRouteReverse =  new routeModel(bodyReverse)
        await newRouteReverse.save();

        return res.status(200).json({
            success : true ,
            message : `Thêm tuyến đường ${req.body.noidi} và ${req.body.noiden} thành công. Hệ thống đã tự thêm tuyến đường ngược lại`,
            body : {
                newRoute,
                newRouteReverse,
                //user
             }
        }); 
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const updateRoute = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;

     
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })
    

        const oldRoute = await routeModel.findOne({_id : req.body.id});
        console.log(oldRoute);
        if(oldRoute.matuyen !== req.body.matuyen){
            const routeKey =  await routeModel.findOne({matuyen : req.body.matuyen});
            if(routeKey) return res.status(200).json({
                success : false ,
                message : `Mã Tuyến đã tồn tại`
            })
        }
        
        if((oldRoute.noidi !== req.body.noidi) || (oldRoute.noiden !== req.body.noiden)){
            const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden })
            if(route) return res.status(200).json({
                success : false ,
                message : `Tuyến đường từ ${req.body.noidi} đến ${req.body.noiden} đã có !.`
            })
        }
       

        const routeOne = await routeModel.findOne({_id : req.body.id});
        const routeTwo = await routeModel.findOne({ noidi : routeOne.noiden , noiden : routeOne.noidi})

        const updateOne = await routeModel.findOneAndUpdate({_id : req.body.id } ,{
            noidi : req.body.noidi ,
            noiden : req.body.noiden ,
            quangduong : req.body.quangduong,
            trangthai : req.body.trangthai,
            thoigian : req.body.thoigian
        })

        const updateTwo = await routeModel.findOneAndUpdate({_id : routeTwo._id} ,{
            noidi : req.body.noiden ,
            noiden : req.body.noidi ,
            quangduong : req.body.quangduong,
            trangthai : req.body.trangthai,
            thoigian : req.body.thoigian
        })
        return res.status(200).json({
            success : true ,
            message : `Sửa tuyến đường ${req.body.noidi} và ${req.body.noiden} thành công. Hệ thống đã tự sửa tuyến đường ngược lại`,
            body : {
               
                updateOne,
                updateTwo
             }
        }); 

    }
    catch(err){
        console.log(err);
        return res.status(200).json({
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

        const route = await routeModel.findOneAndUpdate({_id: req.body.id } , {
            trangthai : req.body.trangthai
        });
        const routeTwo = await routeModel.findOneAndUpdate({
            noidi :  route.noiden ,
            noiden : route.noidi 
         },
         {
            trangthai : req.body.trangthai
         }
        )
        return res.status(200).json({
            success : true ,
            message : 'Cập nhật thành công . Hệ thống sẽ tự động cập tuyến còn lại',
            body : {
                routeOne : route ,
                routeTwo
            }
        }); 

    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const deleteRoute = async(req, res)=>{
    try{
        const vaitro = req.body.vaitro;  
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })
        console.log(req.body);
        const routeOne = await routeModel.findOne({_id : req.body.id});
        const routeTwo = await routeModel.findOne({noidi : routeOne.noiden , noiden : routeOne.noidi});

        const tripOne = await tripModel.find({route : routeOne._id});
        
        if(tripOne.length > 0){
            return res.status(200).json({
                success : false ,
                message : 'Không thể xóa tuyến. Tuyến xe đã có chuyến xe .'
            })
    
        }
        
        const tripTwo = await tripModel.find({route : routeTwo._id });
        if(tripTwo.length > 0){
           return  res.status(200).json({
                success : false ,
                message : 'Không thể xóa tuyến. Tuyến xe ngược lại đã có chuyến xe .'
            })
        }
        await routeModel.findOneAndDelete({_id : routeOne._id})
        await routeModel.findOneAndDelete({_id : routeTwo._id})
       
        return res.status(200).json({
            success : true ,
            message : 'Xóa tuyến thành công',
            body :{
                idOne : routeOne._id,
                idTwo : routeTwo._id
            }
           
        })
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const checkRoute = async(req, res)=>{
    try{
        const id = req.body.id;
        const routeOne = await routeModel.findOne({_id : id});
       

        const tripOne = await tripModel.find({route : routeOne._id});

        console.log('one ' ,tripOne.length)
        if(tripOne.length > 0){
           return res.status(200).json({
                success : true ,
                message : 'Xóa tuyến thành công',
                body : true
               
            })
        }

        const routeTwo = await routeModel.findOne({noidi : routeOne.noiden , noiden : routeOne.noidi});
        const tripTwo = await tripModel.find({route : routeTwo._id});
        console.log('two' , tripTwo.length)
        if(tripTwo.length > 0){
            return res.status(200).json({
                success : true ,
                message : 'Xóa tuyến thành công',
                body : true
               
            })
        }

        return res.status(200).json({
            success : true ,
            message : 'Xóa tuyến thành công',
            body : false
        })
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
module.exports = {
    getAllRoute , 
    insertRoute ,
    updateRoute ,
    changeStatus,
    deleteRoute,
    checkRoute
}