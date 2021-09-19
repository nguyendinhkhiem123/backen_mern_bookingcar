
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
        console.log(req.body);
        const car = await carModel.findOne({_id : req.body.car});  
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden});
        if(car.trangthai === false){
            return res.status(200).json({
                success : false ,
                message : 'Xe đã tạm dừng hoạt động , vui lòng chọn xe khác',   
                }); 
        }
        if(route.trangthai === false){
            return res.status(200).json({
                success : false ,
                message : 'Tuyến đã tạm dừng hoạt động , vui lòng chọn tuyến khác',   
                }); 
        }
        
        // if(car.soluongghe < req.body.soluongve){
        //     return res.status(200).json({
        //         success : false ,
        //         message : 'Số lượng vé lớn hơn số lượng ghế',   
        //         }); 
        // }

        const thoigian = route.thoigian;
        const giodi = req.body.giodi;
        const oldDate = req.body.ngaydi;
        const date = new Date(oldDate.slice(0,10));

        req.body.route =  route._id
        req.body.ngaydi = date;
        req.body.ngayhoanthanh = new Date(Date.UTC (date.getFullYear() , date.getMonth() , date.getDate() +  Math.floor((thoigian +  giodi + 2)/24) ))

        req.body.giohoanthanh = (thoigian + giodi + 2)%24;
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
        return res.status(200).json({
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
        const list = [];
        const newTrip = await tripModel.find({}).populate('car').populate('route');
        return res.status(200).json({
            success : true ,
            message : 'Bạn lấy thành công',
            body : {
                newTrip,
                list
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
const getTicketHoursTrip = async(req ,res)=>{
    try{
      
        const ngaydi = req.query.ngaydi;
        const noidi = req.query.noidi
        const noiden = req.query.noiden;
        const giodi = req.query.giodi;
        
        const oneRoute = await routeModel.findOne({noidi : noidi , noiden : noiden});
        const oneTrip = await tripModel.find({route : oneRoute._id , ngaydi : new Date(ngaydi),  giodi : giodi  , trangthai : "DANGDOI" } ).populate('car').populate('route');

        console.log(oneTrip);

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
               if(resultPromiseOne[i].length < oneTrip[i].car.soluongghe){
                  
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
        console.log(indexOne.length);
        if(indexOne.length > 0){    
                const oneTripFinal = await tripModel.findById(oneTrip[indexMax]._id).populate('car').populate('route');
                   return res.status(200).json({
                    success : true ,
                    message : 'Bạn lấy thành công',
                    body : {
                        Trip : oneTripFinal,
                        numberTicket : oneTripFinal.car.soluongghe - resultPromiseOne[indexMax].length
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
        return res.status(200).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const newDate = (ngay , gio=0)=>{
   
    const date1 =  new Date(ngay);
    const year = date1.getFullYear();
    const month = date1.getMonth();
    const day = date1.getDate()
    
    return new Date(Date.UTC(year , month , day , gio));
}
const updateStausTrip =  async(req, res)=>{
    try{
        const trip_id = req.body.trip;
        const trip = await tripModel.findOne({_id : trip_id});
        let trangthai = "DANGDOI";

        const ngaydi = newDate(trip.ngaydi , trip.giodi);
        const ngayhoanthanh = newDate(trip.ngayhoanthanh , trip.giohoanthanh)
        const ngayhientai = new Date();
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours(), ngayhientai.getMinutes()));
     

        console.log(ngayhientaiLog , ngayhoanthanh , ngaydi);
       
        if( ngaydi <=  ngayhientaiLog  && ngayhientaiLog < ngayhoanthanh){
            console.log('KHOI HANH')
            trangthai = "DANGKHOIHANH"
        }
        if(ngayhientaiLog >= ngayhoanthanh ){
            console.log('HOAN THANH')
            trangthai = "HOANTHANH";
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
const checkUnquieCar = (arrTrip , _id)=>{ // kiểm tra xe có chạy chuyến nào không ?
    let boolean = false;
    for(let i = 0 ; i < arrTrip.length ;i++){
        if(arrTrip[i].car._id === _id) 
        {
            boolean = true;
            break;
        }
    }
    return boolean
}

const checkTrip = (arrTrip , _id , currentDate , currentRoute)=>{  // list đã được sort;
     let boolean = false;
     if(!checkUnquieCar(arrTrip , _id )){
         console.log(_id ,'hello')
            boolean = true;
     }
     else{
         const arrTripFilter = arrTrip.filter(value=>{
             return value.car._id === _id;
         });
         const date = new Date(arrTripFilter[0].ngayhoanthanh);
         const bigDate = new Date(date.getFullYear(), date.getMonth() , date.getDate(), arrTripFilter[0].giohoanthanh);
         const dateTwo = new Date(arrTripFilter[arrTripFilter.length -1].ngaydi);
         const smallDate = new Date(dateTwo.getFullYear(), dateTwo.getMonth() ,dateTwo.getDate(),arrTripFilter[arrTripFilter.length -1].giodi-currentRoute.thoigian-2);
         console.log("date" ,currentDate,bigDate,dateTwo,smallDate , _id)
         if(currentDate >= bigDate){ // thoi gian dat lon nhat  
            console.log( currentRoute._id.toString() , typeof arrTripFilter[0].route._id )
             if(currentRoute._id.toString() !== arrTripFilter[0].route._id.toString()){ // nếu nó khác tuyến
                 boolean = true;
                 console.log('big true one');
             }
             else { 
                 const bigDateTwo = new Date(date.getFullYear(), date.getMonth() , date.getDate(), arrTripFilter[0].giohoanthanh+ currentRoute.thoigian+2); //thoigianhoanthanh + 2
                 if(currentDate >= bigDateTwo){
                     boolean = true  // nếu trùng tuyến
                     console.log('big true two')
                 }
                 else{
                    console.log('big fasle two')
                 }
                
             }
         }else if(currentDate <= smallDate){  // thoi gian dat nho nhat
          
            if(currentRoute._id.toString() !== arrTripFilter[arrTripFilter.length-1].route._id.toString()){ // khác tuyến
                boolean = true
                console.log('small true one')
            }
            else {
                const smallDateTwo = new Date(dateTwo.getFullYear(), dateTwo.getMonth() , dateTwo.getDate(), arrTripFilter[arrTripFilter.length -1].giodi-currentRoute.thogiandi*2-2*2);
                if(currentDate <= smallDateTwo){
                    boolean = true  // trùng tuyến
                    console.log('small true two')
                }
                else{
                   boolean = false;
                   console.log('small false two')
                }
              
            }
         }
         else{
            const dateOne = new Date(arrTripFilter[0].ngaydi);
            const dateTimeOne = new Date(dateOne.getFullYear(), dateOne.getMonth() , dateOne.getDate(), arrTripFilter[0].giodi);
            const datTimeTwo = new Date(dateTwo.getFullYear(), dateTwo.getMonth() , dateTwo.getDate(), arrTripFilter[arrTripFilter.length -1].giodi);

            if(currentDate <= datTimeTwo || currentDate >= dateTimeOne){
                console.log('bằng')
                boolean = false;  // Không nằm trong khoảng thời gian đi
            }
            else{
                let i ; j = -1;
                if(arrTripFilter.length === 1){
                    i = 0;
                    j = 0    
                }
                else{
                    for(let k = 0 ; k < arrTripFilter.length ; k++){
                        const dateValue = new Date(arrTripFilter[k].ngaydi);
                        const dateTimeValue = new Date(dateValue.getFullYear(), dateValue.getMonth() , dateValue.getDate(), arrTripFilter[k].giodi);
                        if(currentDate <= dateTimeValue){
                             i = k ;
                             j = k + 1;  // Tìm kiếm i , j sao a[i].thoigian >= curentDate >= a[j].thoigian
                        }
        
                    }
                   
                }
                console.log(i , j);
                if(i !== -1 && j !==-1){
                    let dateTimeI = null
                    let dateTimeJ = null;
                    const dataI = arrTripFilter[i];
                    const dataJ = arrTripFilter[j];
                    const dateArrI = new Date(arrTripFilter[i].ngaydi);
                    const dateArrJ = new Date(arrTripFilter[j].ngayhoanthanh); 
                    console.log('hello')
                    console.log(currentRoute._id.toString() !== dataI.route._id.toString() && currentRoute._id.toString()=== dataJ.route._id.toString() )
                    if(currentRoute._id.toString() === dataI.route._id.toString() && currentRoute._id.toString() === dataJ.route._id.toString()){  // Nếu trùng tuyến thời gian * 2 , khác tuyến thời gian bình thường
                            console.log('a == b ==c')
                         dateTimeI =new Date(dateArrI.getFullYear(), dateArrI.getMonth() , dateArrI.getDate(), dataI.giodi-currentRoute.thoigian*2-2*2);
                         dateTimeJ =new Date(dateArrJ.getFullYear(), dateArrJ.getMonth() , dateArrJ.getDate(), dataJ.giohoanthanh+currentRoute.thoigian+2);
                     }
                    else if(currentRoute._id.toString() !== dataI.route._id.toString() && currentRoute._id.toString() !== dataJ.route._id.toString()){
                        
                        console.log('a != b !=c')
                        dateTimeI =new Date(dateArrI.getFullYear(), dateArrI.getMonth() , dateArrI.getDate(), dataI.giodi-currentRoute.thoigian-2);
                        dateTimeJ =new Date(dateArrJ.getFullYear(), dateArrJ.getMonth() , dateArrJ.getDate(), dataJ.giohoanthanh);
                    }
                    else if(currentRoute._id.toString() !== dataI.route._id.toString() && currentRoute._id.toString() === dataJ.route._id.toString()){
                        console.log('a != b =c')
                        dateTimeI =new Date(dateArrI.getFullYear(), dateArrI.getMonth() , dateArrI.getDate(), dataI.giodi-currentRoute.thoigian-2);
                        dateTimeJ =new Date(dateArrJ.getFullYear(), dateArrJ.getMonth() , dateArrJ.getDate(), dataJ.giohoanthanh+currentRoute.thoigian+2);
                    } else if(currentRoute._id.toString() === dataI.route._id.toString() && currentRoute._id.toString() !== dataJ.route._id.toString()){
                        console.log('a = b !=c')
                        dateTimeI =new Date(dateArrI.getFullYear(), dateArrI.getMonth() , dateArrI.getDate(), dataI.giodi-currentRoute.thoigian*2-2*2);
                        dateTimeJ =new Date(dateArrJ.getFullYear(), dateArrJ.getMonth() , dateArrJ.getDate(), dataJ.giohoanthanh);
                    }
                    console.log(dateTimeJ , dateTimeI , currentDate);
                    if(currentDate >= dateTimeJ && currentDate <= dateTimeI){
                        boolean = true;
                    }
                    else {
                        boolean = false;
                    }
                }
             
            }
         }
         
     }
     return boolean
     
}


const getCarOfTrip = async(req, res)=>{
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
        if(giodi === 0 || ngaydi === ''){
            return res.status(200).json({
                success : true ,
                body : [],
    
            })
        }
        const date = new Date(ngaydi);
        const route = await routeModel.findOne({noidi : noidi , noiden : noiden});  
        // const routeRe = await  routeModel.findOne({noidi : route.noiden , noiden : route.noidi})
        const currentDate = new Date(date.getFullYear(), date.getMonth() , date.getDate(), giodi);


    
        const allTrip = await tripModel.find({
            trangthai : {$ne : 'DAHUY'}
        }).populate('car').populate('route');
        if(noidi === '' || noiden==='' || giodi === 0 || ngaydi === '') return res.status(200).json({
            success : true ,
            body : [],

        })
        // ticketResult.sort((a, b)=>{
        //     return new Date(a.thoigiandat) < new Date(b.thoigiandat) ? 1 : -1
        // })
        const listCar = [];
        if(allTrip.length > 0){
           allTrip.sort((a,b)=>{
                const dateOne = new Date(a.ngaydi);
                const dateTwo = new Date(b.ngaydi);
                return new Date(dateOne.getFullYear(),dateOne.getMonth(),dateOne.getDate(),a.giodi) <  
                       new Date(dateTwo.getFullYear(),dateTwo.getMonth(),dateTwo.getDate(),b.giodi) ? 1 : -1 
           })
          
           for(let i = 0 ; i < allCar.length ;i++){
               if(checkTrip(allTrip,allCar[i]._id,currentDate,route)){
                    listCar.push(allCar[i]);
               }
           }
       
        }
        else{
            allCar.forEach((value=>{
                listCar.push(value)
            }))
        }

        return res.status(200).json({
            success : true ,
            body : listCar,

        })
        

    }catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : ''

        })
    }
}
// const getCarOfTrip = async(req ,res)=>{
//     try{
//         const vaitro = req.body.vaitro;
//         if(vaitro === 0) return res.status(200).json({
//             success : false ,
//          message : "Bạn không có quyền lấy"
//         })


//         const allCar = await carModel.find({trangthai : true});
//         const noidi = req.body.noidi;
//         const noiden =  req.body.noiden;
//         const ngaydi = req.body.ngaydi;
//         const giodi = req.body.giodi;
//         const date = new Date(ngaydi);
       
//         if(noidi === '' || noiden==='' || giodi === 0 || ngaydi === '') return res.status(200).json({
//             success : true ,
//             body : [],

//         })
//         console.log('date : ' , date);
//         const year = date.getFullYear();
//         const month = date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
//         const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
//         const dateCompare = new Date(`${year}-${month}-${day}`)
//         const dateK = new Date(date.getFullYear(), date.getMonth() , date.getDate(), giodi);
//         const currentDate = new Date();
//         console.log(dateK, currentDate);
//         let whiteListCar = [];
//         const routeOne  = await routeModel.find({noidi : noidi , noiden : noiden}); // Tuyen dang them
//         const routeTwo = await routeModel.find({noidi : noiden , noiden : noidi}); // Tuyen nguoc lai

//         console.log(routeTwo);

//         // const blackOne = await tripModel.find({ 
//         //         ngaydi : dateCompare , 
//         // }).populate('car')        // Nhung tuyen nao cung ngay di thi bo ra 
        
//         const allTrip = await tripModel.find({
//             trangthai : {$ne : 'DAHUY'}
//         }).populate('car');
//           // lấy mảng car 
//         if(allTrip.length > 0 ){  // nếu trong bảng chi tiết chưa có tuyến xe nào thì lấy tất cả xe ;

//             console.log('hello');
//             const carTemp = allTrip.map(value=>{
//                return value.car._id   // nếu không có thì lấy tất cả
//             })

//             whiteListCar = allCar.filter(value=>{
//                 return carTemp.includes(value.biensoxe) === false;
//             })

//             const valueTrip = await Promise.all(routeTwo.map(value =>{
//                 return tripModel.find({
//                     trangthai : {$ne : 'DAHUY'},
//                     route : value._id
//                 }).populate('car');
//             }))
    
//             if(valueTrip.length > 0){
//                 for(let i = 0 ; i < valueTrip.length ;i++){
//                     if(valueTrip[i].length > 0){
//                         valueTrip[i].forEach((value ,index)=>{
//                             const dateTwo = new Date(value.ngayhoanthanh);
//                             console.log('Date two :',dateTwo);
//                             const dateV = new Date(dateTwo.getFullYear(), dateTwo.getMonth() , dateTwo.getDate(), value.giohoanthanh);
//                             // console.log(dateK > dateV , dateK , dateV , giodi , value.giohoanthanh); 
//                             if(dateK > dateV){
//                                 whiteListCar.push(value.car);
//                             }
//                         })
//                     }
                   
//                 }
               
//             }
//             const noteValueTrip =await Promise.all(routeTwo.map(value =>{
//                 return tripModel.find({
//                     trangthai : {$ne : 'DAHUY'},
//                     route : value._id
//                 }).populate('car')
//             }));
//             if(noteValueTrip.length > 0){
//                 for(let i = 0 ; i <noteValueTrip.length ; i++){
//                     if(noteValueTrip[i].length > 0){
//                         noteValueTrip[i].forEach((value ,index)=>{
//                             const dateTwo = new Date(value.ngayhoanthanh);
//                             const dateV = new Date(dateTwo.getFullYear(), dateTwo.getMonth() , dateTwo.getDate(), value.giohoanthanh + 72);
//                             if(dateK > dateV){
//                                 whiteListCar.push(value.car);
//                             }
//                         })
//                     }
                   
//                 }
               
//             }

//         }
//         else{
//             whiteListCar = [...allCar]
//         }
//         let listCar =[];

//         whiteListCar.forEach((value,index)=>{
//             if(listCar.length > 0 ){
//                 // listCar.forEach((values , indexs)=>{
//                 //     if(values.biensoxe !== value.biensoxe){
//                 //         listCar.push(value);
//                 //     }
//                 // })
//                 if(!checkUnquie(listCar , value.biensoxe)){
//                     listCar.push(value);
//                 }
//             }
//             else
//             {
//                 listCar.push(value);
//             }
//         })
//         // listCar = (whiteListCar.filter(value =>{
//         //     return value.trangthai === true;
//         // }))
//         // console.log(listCar);
//         return res.status(200).json({
//             success : true ,
//             body : listCar,
//         })
       

        
//     }
//     catch(err){
//         console.log(err);
//     } 
// }
const updateTrip = async(req,res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền thêm"
        })
        
        const ticketOfTrip = await TicketModel.find({trip : req.body.id});
        
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
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours(), ngayhientai.getMinutes()));

        const ngaydi = new Date(oldTrip.ngaydi);
        const ngaydiLog = new Date(Date.UTC(ngaydi.getFullYear() , ngaydi.getMonth() , ngaydi.getDate() ,oldTrip.ngaydi));

        if(ngayhientaiLog >= ngaydiLog){
            return res.status(200).json({
                success : false ,
             message : "Không thể sửa . chuyến xe đã trạng thái chạy"
            })
        }

        const car = await carModel.findOne({_id : req.body.car});  
        const route = await routeModel.findOne({noidi : req.body.noidi , noiden : req.body.noiden});
        // if(car.soluongghe < req.body.soluongve){
        //     return res.status(200).json({
        //         success : false ,
        //         message : 'Số lượng vé lớn hơn số lượng ghế',   
        //         }); 
        // }

        const thoigian = route.thoigian;
        const giodi = req.body.giodi;
        const oldDate = req.body.ngaydi;
        const date = new Date(oldDate.slice(0,10));

        req.body.route =  route._id
        req.body.ngaydi = date;
        req.body.ngayhoanthanh = new Date(Date.UTC (date.getFullYear() , date.getMonth() , date.getDate() +  Math.floor((thoigian +  giodi + 2)/24) ));
        req.body.giohoanthanh = (thoigian + giodi +2)%24 ;
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
const deleteTrip = async (req, res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
          message : "Bạn không có quyền lấy"
        })
        const id = req.body.id;
        const trip = await tripModel.findOne({_id : id});
        const ticket = await ticketModel.find({trip : id});
        if(ticket.length > 0){
            return res.status(200).json({
               success : false ,
                message : "Chuyến đã có vé xe. Không thể xóa"
            })
        }
        else{
            await tripModel.findOneAndDelete({_id : id})
            return res.status(200).json({
            success : true ,
            message : 'Xóa thành công'
        })
        }
        // if(trip.trangthai === 'DAHUY'){
        //     await tripModel.findOneAndDelete({_id : id})
        //     return res.status(200).json({
        //         success : true ,
        //         message : 'Xóa thành công'
        //     })
        // }
        // else{
          
        // }
       
       
    }
    catch(err){
        console.log(err);
        return res.status(200).json({
            success : false ,
            message : 'Lỗi hệ thống'
        })
    }
}
// const checkUnquie = (arr , biensoxe)=>{
//     let i = false;
//     for(let i = 0 ; i < arr.length ; i++){
//         if(arr[i].biensoxe === biensoxe) return true
//     }
//     return false;
// }
// const checkTrip =  async (req, res)=>{
//     try{
//         const id = req.body.id;

//         const ticket = await ticketModel.find({trip : id});

//         if(ticket.length > 0){
//             return res.status(200).json({
//                 success : true,
//                 body : true
//             })
//         }

//         return res.status(200).json({
//             success : true,
//             body : false
//         })

//     }catch(err){
//         console.log(err);
//         return res.status(200).json({
//             success : false ,
//             message : 'Lỗi hệ thống !!'
//         })
//     }
// }
module.exports = {
    insertTrip,
    getAllTrip,
    getHoursTrip,
    getTicketHoursTrip,
    updateStausTrip,
    cancleTrip,
    getCarOfTrip,
    updateTrip,
    deleteTrip,
}