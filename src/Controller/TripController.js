
const tripModel = require('../Model/TripModel');
const userModel = require('../Model/UserModel');
const carModel = require('../Model/CarModel');
const driverModel = require('../Model/DriverModel');
const routeModel = require('../Model/RouteModel');
const ticketModel = require('../Model/TicketModel');
const { find } = require('../Model/RouteModel');

const insertTrip = async(req , res)=>{
    try{
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        if(user.vaitro !== 'admin') return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền đến thêm"
        })
        // const newRoute = await routeModel.findOne({_id : req.body.route});  // Tuyen duoc them
        // const oldRoute = await routeModel.findOne({noidi : newRoute.noiden , noiden : newRoute.noidi}); // Tuyen nguoc lai
        // let oldTrip =[]
        // oldTrip = await tripModel.find({ route :  oldRoute._id }).populate('car' , 'driver' , 'route'); // danh sách chuyến cũ
        
        // if((oldTrip.length > 0) && (oldTrip[oldTrip.length-1].car._id === req.body.car || oldTrip[oldTrip.length-1].driver._id === req.body.driver)){
        //     // nếu chuyến cũ tồn tại và muốn thêm xe đó đi về chuyến ngược lại
        //     const oldTripLasted = oldTrip[oldTrip.length - 1];
        //     const dateOldTrip = oldTripLasted.ngaydi; //Ngày đi
        //     const hour  = oldTripLasted.giodi;  // Giờ đi
        //     const useHour
        //     if()

            
        // }
        // else{
        //     const car = await carModel.findOne({route : req.body.route}); //Kiểm tra xe có thuộc tuyến đó hay không
        //     if(car._id !== req.body.car) res.status(200).json({
        //         success : true ,
        //         message : 'Thêm thất bại xe không có nằm trong tuyến xe',
            
        //     }); 

        //     const driver = await driverModel.findOne({route : req.body.route}); //Kiểm tra xe có thuộc tuyến đó hay không
        //     if(driver._id !== req.body.driver){
        //         return res.status(200).json({
        //             success : true ,
        //             message : 'Thêm thất bại xe không có nằm tuyến xe',
                
        //     }); 
        //    }
        //     if(!car.trangthai || !driver.trangthai){
        //             return res.status(200).json({
        //                 success : true ,
        //                 message : 'Xe hoặc tài xế đang đi . Không thể thêm được',
                    
        //         });
        //     }
        // }
        const oldDate = req.body.ngaydi
        const date = new Date(oldDate);
        req.body.ngaydi = date;
        const newTrip = new tripModel(req.body);
        await newTrip.save();

        const car = await carModel.findOne({_id : req.body.car});  // trigger thêm vé
        console.log(car);
        const soghe  = car.soluongghe;
        const bodyTicket = []

        for(let i = 0 ; i < soghe ; i++){
            const ticket = {
                trip : newTrip._id,
                soghe : i + 1
            }  
            bodyTicket.push(ticket);
        }
        const ticketInsert = await ticketModel.insertMany(bodyTicket);
        return res.status(200).json({
                    success : true ,
                    message : 'Bạn đã thêm tuyến thành công',
                    body : {
                        newTrip,
                        ticketInsert
                         }
                    }); 
                
    }
    catch(err)
    {
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
const getAllTrip = async(req ,res)=>{
    try{
        // const user = await userModel.findOne({manhanvien: req.body.user_id});
        // if(user.vaitro !== 'admin') return res.status(200).json({
        //     success : false ,
        //     messgae : "Bạn không có quyền đến thêm";
        // })
        const newTrip = await tripModel.find({}).populate('car').populate('route');
        
        return res.status(200).json({
            success : true ,
            message : 'Bạn lấy thành công',
            body : {
                newTrip
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

const getOneTrip = async(req ,res)=>{
    try{
        const ngaydi = req.query.ngaydi;
        const noidi = req.query.noidi;
        const noiden = req.query.noiden;
        console.log(req.query , req.query.ngaydi);
        const oneRoute = await routeModel.findOne({noidi : noidi , noiden : noiden});
        const oneTrip = await tripModel.find({route : oneRoute._id , ngaydi : new Date(ngaydi)}).populate('car').populate('route');
        console.log(oneTrip);
        if(oneTrip.length > 0){
            return res.status(200).json({
                success : true ,
                message : 'Bạn lấy thành công',
                body : {
                    oneTrip
                 }
            }); 
        }
        else{
            return res.status(200).json({
                success : false ,
                message : `không có chuyến xe nào vào ngày ${ngaydi}`
            }); 
        }

       

    }catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
const getTwoTrip = async(req ,res)=>{
    try{
        const ngaydi = req.query.ngaydi;
        const ngayve = req.query.ngayve;
        const noidi = req.query.noidi;
        const noiden = req.query.noiden;
        console.log(req.query)
        const oneRoute = await routeModel.findOne({noidi : noidi , noiden : noiden});
        const oneTrip = await tripModel.find({route : oneRoute._id , ngaydi : new Date(ngaydi)}).populate('car').populate('route');;


        const twoRoute = await routeModel.findOne({noidi : noiden , noiden : noidi});
        const twoTrip = await tripModel.find({route : twoRoute._id , ngaydi : new Date(ngayve)}).populate('car').populate('route');;

        if(twoTrip.length > 0 && oneTrip.length > 0){
            return res.status(200).json({
                success : true ,
                message : 'Bạn lấy thành công',
                body : {
                    oneTrip,
                    twoTrip
                 }
            }); 
        }
        else{
            return res.status(200).json({
                success : false ,
                message : `không có chuyến xe khứ hồi vào ngày ${ngaydi} và ${ngayve}`,
            }); 
        }
    }catch(err){

        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

module.exports = {
    insertTrip,
    getAllTrip,
    getOneTrip,
    getTwoTrip
}