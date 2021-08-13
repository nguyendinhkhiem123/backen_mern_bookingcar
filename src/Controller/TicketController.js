const routeModel = require('../Model/RouteModel');
const ticketModel = require('../Model/TicketModel');
const userModel = require('../Model/UserModel');
const mailer = require('../../Service/Mailer');
const payModel = require('../Model/PayModel');
const cancleModel =  require('../Model/HistoryCancle');
const tripModel = require('../Model/TripModel');

const customerModel = require('../Model/NewModel/CustomerModel')
const getTicketTrip = async(req , res)=>{
    try{
        const trip = await tripModel.findOne({ _id  : req.query.trip}).populate('car');
      
        const listTicket = await  ticketModel.find({

                    trip :  req.query.trip,
                    trangthaive : { $ne : "DAHUY" }
               
        })
    

        console.log(listTicket);
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body :{
                listTicket,
                number : trip.car.soluongghe
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

const getNumberTicket =async(req , res)=>{   // Check kiểm tra vé có đủ hay không
    try{
        // // const loai = req.query.loai;
        // console.log(    req.query.chuyendi, req.query.sovedi);
     
        const chuyendi = req.query.chuyendi;
        const sovedi = req.query.sovedi;

        if(!req.query.chuyendi){
            return res.status(200).json({
                success : false ,
                message : 'Vé xe không đủ sống lượng mua  !. Vui lòng xem lại',
               
            })
        }
        const ticketOne = ticketModel.find({trip :  chuyendi , trangthaighe : "ACTIVE"});
        if(ticketOne.length < sovedi){
            return res.status(200).json({
                success : false ,
                message : 'Vé xe không đủ sống lượng mua  !. Vui lòng xem lại',
               
            })
        }
        return res.status(200).json({
            success : true ,
            message : 'Thành công',
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
const checkOutNumberCar = async(req ,res)=>{
    try{
        console.log(req.body);
        const id = req.body.user_id
        const customer = await customerModel.findOne({_id: req.body.user_id});
        const loai =  req.body.loai;
        const chuyendi = req.body.chuyendi;
        const soghedi = req.body.soghedi;
        const hinhthuc = req.body.hinhthuc;
        const sdt = req.body.sdt;
        const hovaten = req.body.hovaten;
        const email = req.body.email;
        const trangthai = "DADAT";
        let RouteOne = [];
        let RouteTwo = [];
        let chuyenve = null;
        let sogheve =[];
        if(loai === 2){
            chuyenve = req.body.chuyenve
            sogheve = req.body.sogheve
            RouteTwo = await routeModel.findOne({_id : chuyenve.route})
        }

        RouteOne = await routeModel.findOne({_id : chuyendi.route})
       
        const resultPromiseOne = await Promise.all(
            soghedi.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyendi, soghe : value , trangthaive: 'DANGUUTIEN'}, {
                    thoigiandat :  new Date(),
                    trangthaive : trangthai,
                    hovaten : hovaten,
                    sdt : sdt,
                    email :  email ,
                    hinhthucthanhtoan : hinhthuc,
                    trangthaithanhtoan : hinhthuc === "OFFLINE" ? false : true,
                    customer : customer._id,
                   
                })
            })
      
        )
            

        if(loai == 2){
             const resultPromiseTwo = await Promise.all(
                sogheve.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyenve, soghe : value , trangthaive: 'DANGUUTIEN'}, {
                    thoigiandat :  new Date(),
                    trangthaive : trangthai,
                    hovaten : hovaten,
                    sdt : sdt,
                    email :  email ,
                    hinhthucthanhtoan : hinhthuc,
                    trangthaithanhtoan : hinhthucthanhtoan === "OFFLINE" ? false : true,
                    customer : customer._id,
                })
            })
      
        )
        }

        let mailOptions = {}  // Gửi mail
        if(loai == 2){
             mailOptions = {
                from: customer.email,
                to: customer.email,
                subject: 'Nhà xe NDK thông báo',
                text: `Bạn đã đặt xe ở nhà xe chúng tôi có chuyến đi từ vào ngày : ${new Date()}
                       Loại vé : Khứ hồi ,
                       Mã Tuyến :  ${RouteOne.matuyen}
                       Tuyến : ${RouteOne.noidi} || ${RouteOne.noiden}
                       Thông tin chuyến đi :
                            + Chuyến đi : ${RouteOne.noidi} đi ${RouteOne.noiden}
                            + Ngày khởi hành : ${chuyendi.ngaydi}
                            + Giờ bắt đầu :  ${chuyendi.giodi}h
                            + Số vé đăt : ${soghedi.length}
                            + Chỗ đã đặt : ${soghedi.map(value=>value+" , " )}
                            + Giá vé : ${formatMoney(chuyendi.giave.toString())}đ 
                        Thông tin chuyến về :
                            + Chuyến về : ${RouteOne.noiden} đi ${RouteOne.noidi}
                            + Ngày khởi hành : ${chuyenve.ngaydi}
                            + Giờ bắt đầu :  ${chuyenve.giodi}h
                            + Số vé đăt : ${sogheve.length}
                            + Chỗ đã đặt : ${sogheve.map(value=>value+" , ")}  
                            + Giá vé : ${formatMoney(chuyenve.giave.toString())}đ 
                        Tổng vé : ${soghedi.length +  sogheve.length}
                        Tổng tiền : ${formatMoney(((soghedi.length*chuyendi.giave)+(sogheve.length*chuyenve.giave)).toString())+"đ"}
                        Hình thức thanh toán : ${hinhthuc === "OFFLINE" ?  "Thanh toán khi lên xe" : "Thanh toán qua paypal"}
                        Trang thái: ${hinhthuc === "OFFLINE" ?  "Chưa thanh toán" : "Đã thanh toán"}    
                        Quy khách hãy nhớ đến nơi đùng giờ !!. Nhà xe xin cám ơn`    // Nôi dụng khứ hồi 
              };
           
        }
        else{
             mailOptions = {
                from: customer.email,
                to: customer.email,
                subject: 'Nhà xe NDK thông báo',
                text: `Bạn đã đặt xe ở nhà xe chúng tôi có chuyến đi từ vào ngày : ${new Date()}
                Loại vé : Một chiều ,
                Mã Tuyến :  ${RouteOne.matuyen}
                Tuyến : ${RouteOne.noidi} || ${RouteOne.noiden}
                Thông tin chuyến đi :
                     + Chuyến đi : ${RouteOne.noidi} đi ${RouteOne.noiden}
                     + Ngày khởi hành : ${chuyendi.ngaydi}
                     + Giờ bắt đầu :  ${chuyendi.giodi}h
                     + Số vé đăt : ${soghedi.length}
                     + Chỗ đã đặt : ${soghedi.map(value=>value+",")}
                     + Giá vé : ${formatMoney(chuyendi.giave.toString())}đ 
                     Tổng tiền : ${formatMoney(((soghedi.length)*chuyendi.giave).toString())+"đ"}
                     Hình thức thanh toán : ${hinhthuc === "OFFLINE" ?  "Thanh toán khi lên xe" : "Thanh toán qua paypal"}
                     Trang thái: ${hinhthuc === "OFFLINE" ?  "Chưa thanh toán" : "Đã thanh toán"}   
                     Quy khách hãy nhớ đến nơi đùng giờ !!. Nhà xe xin cám ơn      
                   
                `
                
              }
        }
        mailer.sendMail(mailOptions ,function(error, info){
            if (error) {
              console.log(error);
            } else {
                return res.status(200).json({
                    success : true ,
                    message : 'Đặt vé thành công',
                })
                console.log('Email sent: ' + info.response);
                
            
            };
        
        })   

    }
    catch(err){
        console.log(err)
        return res.json ({
            success  : false,
            message : "Lỗi hệ thống"
        })
    }
}


const checkNumberCar = async(req, res)=>{
    try{
        const soghedi = req.body.soghedi;
        const chuyendi = req.body.chuyendi;
        const ticketNumberCarOne = await ticketModel.find({soghedi : {
            $in: soghedi.map(value => value)
         },
            trip :  chuyendi ,
            trangthaive : { $ne : "DAHUY" }
          }   
        ).populate('trip')

        if(ticketNumberCarOne.length > 0){
            RouteOne = await routeModel.findOne({_id : ticketNumberCarOne[0].trip.route})
        }
      

        if(ticketNumberCarOne.length > 0){
            return res.status(200).json({
                success : false ,
                message : `Số ghế  của chuyến ${RouteOne.noidi} đến ${RouteOne.noiden} đã có người đặt  !. Vui xem lại`,
            
            })
        }
        return res.status(200).json({
            success : true ,
            message : 'Đặt vé thành công',
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const updatStatusTicket = async(req ,res)=>{
    try{
        const trangthai =  req.body.trangthai;
        const soghedi = req.body.soghedi;
        const chuyendi = req.body.chuyendi;
        console.log(req.body);
        const resultPromiseOne = await Promise.all(
            soghedi.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyendi, soghe : value , trangthaive : 'DANGUUTIEN'}, {
                    trangthaive : trangthai
                })
            })
        );
        console.log(resultPromiseOne);
        if(resultPromiseOne.length > 0){
            res.status(200).json({
                success : true ,
                message : 'Thành công',
               
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
const insertTicket = async(req ,res)=>{
    try{
        const soghedi = req.body.soghedi;
        const chuyendi = req.body.chuyendi;

        const list = await ticketModel.insertMany(soghedi.map((value,index)=>{
            return {
                soghe : value,
                trip : chuyendi
            }
        }))
        if(list.length > 0){
            res.status(200).json({
                success : true ,
                message : 'Thành công',
               
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
} 
const getTicketOfUser = async(req, res)=>{
    try{
        const id = req.body.user_id
        const getTicket =  await ticketModel.find({customer : id , trangthaive : 'DADAT'}).populate('trip');

        console.log(getTicket);
        return res.status(200).json({
            success : true,
            message : "Lấy thông tin thành công",
            body : getTicket
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const cancleTicket = async(req, res)=>{
    try{
        const id = req.body.id
        
        
        const updateTicket =  await ticketModel.findOneAndUpdate({
            _id :  id 
        },
            {
               trangthaive : 'DAHUY',
               ngayhuy : new Date(),
               tienphat : 10000
            } 
        ) 
        
        const ticket = await ticketModel.findOne({_id : updateTicket._id})
        return res.status(200).json({
            success : true,
            message : "Hủy vé thành công",
            boyd : ticket
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
const formatMoney=(n) =>{
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}  
const getTicketOfTrip = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền "
        })
   
        const listTicket = await  ticketModel.find({

                    trip :  req.query.id,
                    // trangthaive : { $ne : "DAHUY" },
                    thoigiandat : { $ne : null}

               
        }).populate('trip')
    

        console.log(listTicket);
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body :{
                listTicket,
                // number : trip.car.soluonggh
            } 
        }); 
    }catch(err){
        console.log(err)
    }
}
const getSlotCar = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền "
        })
        const trip_id = req.body.trip;
        const trip = await tripModel.findOne({_id : trip_id}).populate('car').populate('route');

        let listSlot = [];
        let listResultSlot = [];
        let listSlotChose = [];
        for(let i = 0 ; i < trip.car.soluongghe ; i++) listSlot.push(i+1);
        
        const ticket = await ticketModel.find({trip : trip_id , trangthaive : { $ne : "DAHUY"}
        });

        ticket.forEach((value , index)=>{
            listSlotChose.push(value.soghe)
        })
        listSlot.forEach((value,index)=>{
            if(!listSlotChose.includes(value)) listResultSlot.push(value)
        })
        console.log(listSlot.length , listResultSlot.length);
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : listResultSlot
        }); 
    }catch(err){
        console.log(err)
    }
}
const insertTicketOfAdmin = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền "
        });

        const trip_id = req.body.trip;
        const trip = await tripModel.findOne({_id : trip_id}).populate('car').populate('route');
        const ticket = await ticketModel.find({trip : trip_id , trangthaive : { $ne : "DAHUY"}
          });

        const ngayhientai = new Date();
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours()));

        const ngaydi = new Date(trip.ngaydi);
        const ngaydiLog = new Date(Date.UTC(ngaydi.getFullYear() , ngaydi.getMonth() , ngaydi.getDate() ,trip.giodi));
        if(ngayhientaiLog > ngaydiLog){
            return res.status(200).json({
                success : false ,
               message : "Không thể thêm . chuyến xe đã trạng thái chạy"
            })
        }
        
        if(ticket.length + 1 > trip.soluongve) return res.status(200).json({
            success : false ,
            message : "Vé xe đã hết. Vui lòng chọn lại"
        })
        
        const checkSlot = await ticketModel.findOne({trip : trip_id , trangthaive : { $ne : "DAHUY"} , soghe : req.body.soghe });

        if(checkSlot){
            return res.status(200).json({
                success : false ,
                message : "Chỗ ngồi đã được đặt rồi . Vui lòng chọn lại"
            })
        }
      
        const body = {
            thoigiandat : new Date(),
            soghe : req.body.soghe ,
            hovaten : req.body.hovaten,
            sdt : req.body.sdt ,
            email : req.body.email,
            hinhthucthanhtoan : req.body.hinhthucthanhtoan,
            trangthaithanhtoan  :req.body.trangthaithanhtoan,
            trangthaive : "DADAT",
            trip : req.body.trip ,
            customer : null
        }
        const newTicket = new ticketModel(body)
        await newTicket.save();

        const ticketFindal = await ticketModel.findOne({_id : newTicket._id}).populate('trip')
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : ticketFindal
        }); 
    }catch(err){
        console.log(err)
    }
}
const updateTicketOfAdmin = async(req , res)=>{
    try{
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
             message : "Bạn không có quyền "
        });

        const trip_id = req.body.trip;
        const trip = await tripModel.findOne({_id : trip_id}).populate('car').populate('route');
        const ticket = await ticketModel.find({trip : trip_id , trangthaive : { $ne : "DAHUY"}
          });

        const ngayhientai = new Date();
        const ngayhientaiLog = new Date(Date.UTC(ngayhientai.getFullYear() , ngayhientai.getMonth() , ngayhientai.getDate() ,ngayhientai.getHours()));

        const ngaydi = new Date(trip.ngaydi);
        const ngaydiLog = new Date(Date.UTC(ngaydi.getFullYear() , ngaydi.getMonth() , ngaydi.getDate() ,trip.giodi));
        if(ngayhientaiLog > ngaydiLog){
            return res.status(200).json({
                success : false ,
               message : "Không thể cập nhật . chuyến xe đã trạng thái chạy"
            })
        }
        
        // if(ticket.length + 1 > trip.soluongve) return res.status(200).json({
        //     success : false ,
        //     message : "Vé xe đã hết. Vui lòng chọn lại"
        // })
        
        const checkSlot = await ticketModel.findOne({trip : trip_id , trangthaive : { $ne : "DAHUY"} , soghe : req.body.soghe , _id : { $ne : req.body.id} });

        if(checkSlot){
            return res.status(200).json({
                success : false ,
                message : "Chỗ ngồi đã được đặt rồi . Vui lòng chọn lại"
            })
        }
      
        const body = {
          
            soghe : req.body.soghe ,
            hovaten : req.body.hovaten,
            sdt : req.body.sdt ,
            email : req.body.email,
            hinhthucthanhtoan : req.body.hinhthucthanhtoan,
            trangthaithanhtoan  :req.body.trangthaithanhtoan,
        }
        const newTicket = await ticketModel.findOneAndUpdate({_id : req.body.id }, body);
     

        const ticketFindal = await ticketModel.findOne({_id : newTicket._id}).populate('trip');
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã cập nhật thành công',
            body : ticketFindal
        }); 
    }catch(err){
        console.log(err)
    }
}


module.exports ={
    getTicketTrip,
    getNumberTicket,
    updatStatusTicket,
    checkNumberCar,
    checkOutNumberCar,
    getTicketOfUser,
    cancleTicket,
    insertTicket,
    getTicketOfTrip,
    getSlotCar,
    insertTicketOfAdmin,
    updateTicketOfAdmin
}


