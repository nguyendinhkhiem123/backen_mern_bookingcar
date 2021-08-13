
const tripModel = require('../Model/TripModel');
const carModel = require('../Model/CarModel');
const routeModel = require('../Model/RouteModel');
const ticketModel = require('../Model/TicketModel');
const TicketModel = require('../Model/TicketModel');
const TripModel = require('../Model/TripModel');


const insertTrip = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
         message : "Bạn không có quyền thêm"
        })
        const car = await carModel.findOne({_id : req.body.car});  
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden});
        if(car.soluongghe < req.body.soluongve){
            return res.status(200).json({
                success : false ,
                message : 'Số lượng vé lớn hơn số lượng ghế',   
                }); 
        }

        const thoigian = route.thoigian;
        const giodi = req.body.giodi;
        const oldDate = req.body.ngaydi;
        const date = new Date(oldDate.slice(0,10));

        req.body.route =  route._id
        req.body.ngaydi = date;
        req.body.ngayhoanthanh = new Date(Date.UTC (date.getFullYear() , date.getMonth() , date.getDate() +  Math.floor((thoigian +  giodi)/24) ))

        req.body.giohoanthanh = (thoigian + giodi)%24 + 2;
        const newTrips = new tripModel(req.body);
        await newTrips.save();
        const newTrip = await tripModel.find({_id : newTrips._id}).populate('car').populate('route');
        console.log(newTrip)
        return res.status(200).json({
                    success : true ,
                    message : 'Bạn đã thêm tuyến thành công',
                    body : {
                        newTrip
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
        const vaitro = req.body.vaitro;  
        if(vaitro === 0) return res.status(200).json({
            success : false ,
         message : "Bạn không có quyền lấy"
        })
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
const getTicketHoursTrip = async(req ,res)=>{
    try{
      
        const ngaydi = req.query.ngaydi;
        const noidi = req.query.noidi
        const noiden = req.query.noiden;
        const giodi = req.query.giodi;
        
        const oneRoute = await routeModel.findOne({noidi : noidi , noiden : noiden});
        const oneTrip = await tripModel.find({route : oneRoute._id , ngaydi : new Date(ngaydi),  giodi : giodi  , trangthai : "DANGDOI" } ).populate('car').populate('route');


        const resultPromiseOne = await Promise.all(
            oneTrip.map((value,index)=>{
                return ticketModel.find({
                    trip : value._id,
                    trangthaive : { $ne : "DAHUY" }
                       
            })
         }
        )
        )

        let indexOne = [];
        for(let i = 0 ; i < resultPromiseOne.length; i++ ){
               if(resultPromiseOne[i].length < oneTrip[i].soluongve){
                    indexOne.push(resultPromiseOne[i]);
               }
        }

        let max = -1;
        let indexMax;
        for(let i = 0 ; i < resultPromiseOne.length ; i++){
            if(resultPromiseOne[i].length > max){
                max = resultPromiseOne[i].length;
                indexMax = i
            }
        }

        if(indexOne.length > 0){    

                const oneTripFinal = await tripModel.findById(oneTrip[indexMax]._id).populate('car').populate('route');
                   return res.status(200).json({
                    success : true ,
                    message : 'Bạn lấy thành công',
                    body : {
                        Trip : oneTripFinal,
                        numberTicket : oneTripFinal.soluongve - resultPromiseOne[indexMax].length
                     }
                }); 
                
        }
        else{
            return res.status(200).json({
                    success : false ,
                    message : `Tất cả các từ tuyến ${noidi} đến  ${noiden} đều hết vé ! vui lòng chọn ngày khác`
            }); 
        }
    }catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
const unique = (arr)=> {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) === -1) {
        newArr.push(arr[i])
      }
    }
    return newArr
}
const getHoursTrip = async(req ,res)=>{
    try{
        const loai = req.query.loai;
        const ngaydi = req.query.ngaydi;
        const noidi = req.query.noidi;
        const noiden = req.query.noiden;
        let ngayve = "";
        const oneRoute = await routeModel.findOne({noidi : noidi , noiden : noiden});
        const oneTrip = await tripModel.find({route : oneRoute._id , ngaydi : new Date(ngaydi) ,  trangthai : "DANGDOI"})
        if(oneTrip.length === 0){
            return res.status(200).json({
                success : false ,
                message : `không có chuyến xe vào ngày ${ngaydi} `
            }); 
        }
        let hoursOne=[];
        oneTrip.forEach((value, index)=>{
            hoursOne.push(value.giodi);
        })
        hoursOne = unique(hoursOne);

        let hoursTwo =[];
        if(loai == 2){
            ngayve = req.query.ngayve;
            const twoRoute = await routeModel.findOne({noidi : noiden , noiden : noidi});
            const twoTrip = await tripModel.find({route : twoRoute._id , ngaydi : new Date(ngayve) , trangthai : "DANGDOI"})
            console.log(twoTrip.length , 123)
            if(twoTrip.length === 0){
                return res.status(200).json({
                    success : false ,
                    message : `không có chuyến xe khứ hồi vào ngày ${ngaydi} và ${ngayve}`,
                }); 
            }

            twoTrip.forEach((value, index)=>{
                hoursTwo .push(value.giodi);
            })
        }


        
        return res.status(200).json({
                success : true ,
                message : 'Bạn lấy thành công',
                body : {
                    hoursOne  : hoursOne,
                    hoursTwo : hoursTwo
                 }
            }); 
       
    }catch(err){

        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const newDate = (ngay , gio=0)=>{
    const n = Math.floor(gio/24);
    const m = gio%24;
    const date1 =  new Date(ngay);
    const year = date1.getFullYear();
    const month = date1.getMonth();
    const day = date1.getDate()+n
    
    return new Date(Date.UTC(year , month , day , m));
}


const updateStausTrip =  async(req, res)=>{
    try{
        const trip_id = req.body.trip;
        const trip = await tripModel.findOne({_id : trip_id});
        let trangthai = "DANGDOI";

        const ngaydi = newDate(trip.ngaydi , trip.giodi);
        const ngayhoanthanh = newDate(trip.ngayhoanthanh , trip.giohoanthanh)
        const ngayhientai = new Date();
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours()));
     

        if(ngayhientaiLog > ngayhoanthanh ){
            trangthai = "HOANTHANH";
        }
        if( ngaydi <  ngayhientaiLog  && ngayhientaiLog < ngayhoanthanh){
            
            trangthai = "DANGKHOIHANH"
        }

        if(trip.trangthai === trangthai) 
        {
            if(trangthai === "HOANTHANH")
            return res.status(200).json({
            success : false ,
            message : `Trạng thái chuyến xe giờ là ${trip.trangthai}. Đã kết thúc cập nhật`,
        
             });
            else return res.status(200).json({
                success : false ,
                message : `Trạng thái chuyến xe giờ là ${trip.trangthai}. Chưa đến thời gian để cập nhật bước tiếp theo`,
            
                 });
        }
        else {
            await tripModel.findOneAndUpdate({
                    _id : trip_id
                },
                {
                    trangthai : trangthai
                }
            
            ) 

            const updateTrip = await tripModel.findOne({_id : trip_id}).populate('route').populate('car');
            return  res.status(200).json({
                success : true ,
                message : `Cập nhật thành công`,
                body : updateTrip
            
            });
        }
    }catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lỗi hệ thống !!'
        })
    }
}

const cancleTrip  = async(req, res)=>{
    try{
        const trip_id = req.body.trip;
        
        await tripModel.findOneAndUpdate({_id : trip_id} , { trangthai : "DAHUY"});

        await ticketModel.updateMany({ trip : trip_id}, { trangthaive : "DAHUY"});
        return  res.status(200).json({
            success : true ,
            message : `Hủy chuyến thành công . Tất cả các vé xe sẽ được hủy theo`,
        
        });
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lỗi hệ thống !!'
        })
    }
}
const getCarOfTrip = async(req ,res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
         message : "Bạn không có quyền lấy"
        })


        const allCar = await carModel.find({trangthai : true});
        const noidi = req.body.noidi;
        const noiden =  req.body.noiden;
        const ngaydi = req.body.ngaydi;
        const giodi = req.body.giodi;
        const date = new Date(ngaydi);
        if(noidi === '' || noiden==='' || giodi === 0 || ngaydi === '') return res.status(200).json({
            success : true ,
            body : allCar,

        })
        const year = date.getFullYear();
        const month = date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
        const dateCompare = new Date(`${year}-${month}-${day}`)
    
        
        const blackListCar = [];
        const routeOne  = await routeModel.find({noidi : noidi , noiden : noiden}); // Tuyen dang them
        const routeTwo = await routeModel.find({noidi : noiden , noiden : noidi}); // Tuyen nguoc lai

        
        const blackOne = await tripModel.find({ 
                    ngaydi : dateCompare , 
                }).populate('car')        // Nhung tuyen nao cung ngay di thi bo ra 
        
      
        
        const blackTwo = await tripModel.find({  // Xet tuyen nguoc lai , neu ngay hoan thanh 
                    route :  routeTwo._id,
                    ngayhoanthanh  : dateCompare
        }).where('giohoanthanh').gte(giodi).populate('car');  // lớn hơn

    
        if(blackOne.length > 0){
            blackOne.forEach(element => {
                blackListCar.push(element.car)
            }); 
        }
        if(blackTwo.length > 0){
            blackTwo.forEach(element => {
                blackListCar.push(element.car)
            }); 
        }
    
        const filterBlack =  blackListCar.filter( value =>{
            return value.trangthai === true
        })

        const listCar = [];

        const blackFinal = filterBlack.map(value =>{
            return value.biensoxe
        })
        allCar.forEach((value ,index)=>{
            if(!blackFinal.includes(value.biensoxe)) 
            {
                listCar.push(value);
            }

        })
        console.log(listCar.length , filterBlack.length , blackFinal);
        return res.status(200).json({
            success : true ,
            body : listCar,
        })
       

        
    }
    catch(err){
        console.log(err);
    } 
}
const updateTrip = async(req,res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền thêm"
        })
        
        const ticketOfTrip = await TicketModel.find({trip : req.body.id  , hovaten : { $ne  : ''}});
        
        if(ticketOfTrip.length > 0 ){
            return res.status(200).json({
                success : false ,
             message : "Không thể sửa . Đã có vé xe rồi"
            })
        }

        console.log(req.body);
        const oldTrip = await TripModel.findOne({_id : req.body.id});
        if(oldTrip.trangthai === "DAHUY"){
            return res.status(200).json({
                success : false ,
                message : "Không thể sửa . Chuyến xe đã hủy"
            })
        }
        const ngayhientai = new Date();
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours()));

        const ngaydi = new Date(oldTrip.ngaydi);
        const ngaydiLog = new Date(Date.UTC(ngaydi.getFullYear() , ngaydi.getMonth() , ngaydi.getDate() ,oldTrip.ngaydi));

        if(ngayhientaiLog > ngaydiLog){
            return res.status(200).json({
                success : false ,
             message : "Không thể sửa . chuyến xe đã trạng thái chạy"
            })
        }

        const car = await carModel.findOne({_id : req.body.car});  
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden});
        if(car.soluongghe < req.body.soluongve){
            return res.status(200).json({
                success : false ,
                message : 'Số lượng vé lớn hơn số lượng ghế',   
                }); 
        }

        const thoigian = route.thoigian;
        const giodi = req.body.giodi;
        const oldDate = req.body.ngaydi;
        const date = new Date(oldDate.slice(0,10));

        req.body.route =  route._id
        req.body.ngaydi = date;
        req.body.ngayhoanthanh = new Date(Date.UTC (date.getFullYear() , date.getMonth() , date.getDate() +  Math.floor((thoigian +  giodi)/24) ))

        req.body.giohoanthanh = (thoigian + giodi)%24 + 2;
        await TripModel.findOneAndUpdate({_id : req.body.id }, req.body)
        const newTrip = await tripModel.findOne({_id : req.body.id}).populate('car').populate('route');

        return res.status(200).json({
                    success : true ,
                    message : 'Bạn đã cập nhật thành công',
                    body :  newTrip
                         
                    }); 
    }
    catch(err){
        console.log(err);
    }
}
module.exports = {
    insertTrip,
    getAllTrip,
    getHoursTrip,
    getTicketHoursTrip,
    updateStausTrip,
    cancleTrip,
    getCarOfTrip,
    updateTrip
}