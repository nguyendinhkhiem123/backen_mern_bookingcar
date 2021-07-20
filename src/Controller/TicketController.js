const routeModel = require('../Model/RouteModel');
const ticketModel = require('../Model/TicketModel');
const userModel = require('../Model/UserModel');
const mailer = require('../../Service/Mailer');
const payModel = require('../Model/PayModel');
const cancleModel =  require('../Model/HistoryCancle')
const getTicketTrip = async(req , res)=>{
    try{
        const listTicket = await ticketModel.find({trip :  req.query.trip})
        return res.status(200).json({
            success : true ,
            message : 'Bạn đã thêm thành công',
            body : listTicket
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
        const user = await userModel.findOne({manhanvien: req.body.user_id});
        const loai =  req.body.loai;
        const chuyendi = req.body.chuyendi;
        const soghedi = req.body.soghedi;
        const hinhthuc = req.body.hinhthuc;
        const sdt = req.body.sdt;
        const hovaten = req.body.hovaten;
        const trangthai = "COMPLETE";
        let RouteOne = [];
        let RouteTwo = [];
        let chuyenve = null;
        let sogheve =[];
        if(loai === 2){
            chuyenve = req.body.chuyenve
            sogheve = req.body.sogheve

            console.log(sogheve);
            RouteTwo = await routeModel.findOne({_id : chuyenve.route})
        }

        RouteOne = await routeModel.findOne({_id : chuyendi.route})
       
        let payBody = {
            ngaythanhtoan : hinhthuc === "OFFLINE" ? null : new Date(),
            loaive : loai == 2 ? "KHỨ HỒI" : "MỘT CHIỀU",
            chieudi : chuyendi,
            sovedi : soghedi.length,
            chieuve : chuyenve,
            soveve : sogheve.length > 0 ? sogheve.length : 0,
            giavedi : chuyendi.giave,
            giaveve : chuyenve ? chuyenve.giave : 0,
            trangthai : hinhthuc === "OFFLINE"? false : true,
            hinhthuc : hinhthuc,
            user : user._id 
        }

        let payOne = new payModel(payBody)

        await payOne.save();

        const resultPromiseOne = await Promise.all(
            soghedi.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyendi, soghe : value}, {
                    thoigiandat :  new Date(),
                    trangthaighe : trangthai,
                    nguoinhan : hovaten,
                    sdt : sdt,
                    user : user._id,
                    pay : payOne._id,
                })
            })
      
        )
   
        if(loai == 2){
             const resultPromiseTwo = await Promise.all(
                sogheve.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyenve, soghe : value}, {
                    thoigiandat :  new Date(),
                    trangthaighe : trangthai,
                    nguoinhan : hovaten,
                    sdt : sdt,
                    user : user._id,
                    pay : payOne._id,
                })
            })
      
        )
        }

        let mailOptions = {}  // Gửi mail
        if(loai == 2){
             mailOptions = {
                from: user.email,
                to: user.email,
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
                from: user.email,
                to: user.email,
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
const updateCarNumber = async(req , res) =>{  // Check lần cuối trước khi check out , kiểm tra số lượng số ghế
    try{    
            const user = await userModel.findOne({manhanvien: req.body.user_id});
            const loai =  req.body.loai;
            const chuyendi = req.body.chuyendi;
            const soghedi = req.body.soghedi;
            const hinhthuc = req.body.hinhthuc;
            const sdt = req.body.sdt;
            const hovaten = req.body.hovaten;
            let chuyenve = 0
            let sogheve =[];
            let RouteOne = [];
            let booleanOne = 0;
            let booleanTwo = 0;
            let ticketNumberCarTwo = [];
            const ticketOne = await ticketModel.find({trip :  chuyendi , thoigiandat : null});
        
            if(ticketOne.length < soghedi.length){
                return res.status(200).json({
                    success : false ,
                    message : 'Vé xe không đủ sống lượng mua  !. Vui lòng xem lại',
                   
                })
            };

            const ticketNumberCarOne = await ticketModel.find({soghe : {
                    $in: soghedi.map(value => value)
                },
                trip :  chuyendi 
            }   
                ).populate('trip')

            if(ticketNumberCarOne.length > 0){
                RouteOne = await routeModel.findOne({_id : ticketNumberCarOne[0].trip.route})
            }
            console.log(ticketNumberCarOne)
            ticketNumberCarOne.forEach((value,index) => {
                if(value.thoigiandat !== null) {
                        booleanOne = value.soghe;
                        
                }                
            });
    
            if(booleanOne > 0){
                return res.status(200).json({
                    success : false ,
                    message : `Số ghế  của chuyến ${RouteOne.noidi} đến ${RouteOne.noiden} đã có người đặt  !. Vui xem lại`,
                   
                })
            }
            //  KIỂM TRA SỐ VÉ , GHẾ CÓ TRÙNG HAY KHÔNG CỦA CHUYẾN VỀ
            if(loai === 2){  //TRƯỜNG HỢP KHỨ HỒI
                 chuyenve = req.body.chuyenve;
                 sogheve = req.body.sogheve;
                const ticketTwo = await ticketModel.find({trip :  chuyenve , thoigiandat : null});
                if(ticketTwo.length < sogheve.length){
                    return res.json({
                        success : false ,
                        message : 'Vé xe không đủ sống lượng mua  !. Vui lòng xem lại',
                       
                    })
                };
    
                ticketNumberCarTwo = await ticketModel.find({
                    soghe : {
                        $in: sogheve.map(value => value)
                    } ,
                    trip :  chuyenve
                    }        
                    ).populate('trip');

                ticketNumberCarTwo.forEach((value,index) => {
                    if(value.thoigiandat !== null) {
                        booleanTwo = value.soghe;
                        
                     }   
                }); 
                if(booleanTwo > 0){
                    return res.json({
                        success : false ,
                        message : `Số ghế  của chuyến ${RouteOne.noidem} đến ${RouteOne.noidi} đã có người đặt  !. Vui xem lại`,
                       
                    })
                }
               


            }  
            // THÊM GHẾ VÀO CHUYẾN ĐI
            soghedi.forEach(async(value, index)=>{
                await ticketModel.findOneAndUpdate({trip : chuyendi , soghe : value},{
                    thoigiandat :  new Date(),
                    nguoinhan : hovaten,
                    sdt : sdt,
                    hinhthuc : hinhthuc,
                    thanhtoan : hinhthuc === "OFFLINE" ? false : true,
                    user : user._id
                })
            })
               //THÊM GHẾ VÀO CHUYẾN VỀ
            console.log(sogheve);
            if(loai === 2){
                sogheve.forEach(async(value, index)=>{
                    await ticketModel.findOneAndUpdate({trip : chuyenve , soghe : value},{
                        thoigiandat :  new Date(),
                        nguoinhan : hovaten,
                        sdt : sdt,
                        hinhthuc : hinhthuc,
                        thanhtoan : hinhthuc === "OFFLINE" ? false : true,
                        user : user._id
                    })
                })
            }

            let mailOptions = {}  // Gửi mail
            if(loai === 2){
                 mailOptions = {
                    from: user.email,
                    to: user.email,
                    subject: 'Nhà xe NDK thông báo',
                    text: `Bạn đã đặt xe ở nhà xe chúng tôi có chuyến đi từ vào ngày : ${new Date()}
                           Loại vé : Khứ hồi ,
                           Mã Tuyến :  ${RouteOne.matuyen}
                           Tuyến : ${RouteOne.noidi} || ${RouteOne.noiden}
                           Thông tin chuyến đi :
                                + Chuyến đi : ${RouteOne.noidi} đi ${RouteOne.noiden}
                                + Ngày khởi hành : ${ticketNumberCarOne[0].trip.ngaydi}h
                                + Giờ bắt đầu :  ${ticketNumberCarOne[0].trip.giodi}
                                + Số vé đăt : ${soghedi.length}
                                + Chỗ đã đặt : ${soghedi.map(value=>value+" , " )}
                            Thông tin chuyến về :
                                + Chuyến về : ${RouteOne.noiden} đi ${RouteOne.noidi}
                                + Ngày khởi hành : ${ticketNumberCarTwo[0].trip.ngaydi}h
                                + Giờ bắt đầu :  ${ticketNumberCarTwo[0].trip.giodi}
                                + Số vé đăt : ${sogheve.length}
                                + Chỗ đã đặt : ${sogheve.map(value=>value+" , ")}   
                            Tổng tiền : ${formatMoney(((soghedi.length*sogheve.length)*RouteOne.giave).toString())+"đ"}
                            Hình thức thanh toán : ${hinhthuc === "OFFLINE" ?  "Thanh toán khi lên xe" : "Thanh toán qua paypal"}
                            Trang thái: ${hinhthuc === "OFFLINE" ?  "Chưa thanh toán" : "Đã thanh toán"}    
                            Quy khách hãy nhớ đến nơi đùng giờ !!. Nhà xe xin cám ơn`    // Nôi dụng khứ hồi 
                  };
               
            }
            else{
                 mailOptions = {
                    from: user.email,
                    to: user.email,
                    subject: 'Nhà xe NDK thông báo',
                    text: `Bạn đã đặt xe ở nhà xe chúng tôi có chuyến đi từ vào ngày : ${new Date()}
                    Loại vé : Một chiều ,
                    Mã Tuyến :  ${RouteOne.matuyen}
                    Tuyến : ${RouteOne.noidi} || ${RouteOne.noiden}
                    Thông tin chuyến đi :
                         + Chuyến đi : ${RouteOne.noidi} đi ${RouteOne.noiden}
                         + Ngày khởi hành : ${ticketNumberCarOne[0].trip.ngaydi}
                         + Giờ bắt đầu :  ${ticketNumberCarOne[0].trip.giodi}h
                         + Số vé đăt : ${soghedi.length}
                         + Chỗ đã đặt : ${soghedi.map(value=>value+",")}
                         Tổng tiền : ${formatMoney(((soghedi.length)*RouteOne.giave).toString())+"đ"}
                         Hình thức thanh toán : ${hinhthuc === "OFFLINE" ?  "Thanh toán khi lên xe" : "Thanh toán qua paypal"}
                         Trang thái: ${hinhthuc === "OFFLINE" ?  "Chưa thanh toán" : "Đã thanh toán"}   
                         Quy khách hãy nhớ đến nơi đùng giờ !!. Nhà xe xin cám ơn      
                       
                    // Nôi dụng khi đặt 1 mình`
                    
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

        console.log(err);
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}

const checkNumberCar = async(req, res)=>{
    try{
        const soghedi = req.body.soghedi;
        const chuyendi = req.body.chuyendi;
        let booleanOne = 0;
        const ticketNumberCarOne = await ticketModel.find({soghedi : {
            $in: soghedi.map(value => value)
        },
        trip :  chuyendi 
          }   
        ).populate('trip')

        if(ticketNumberCarOne.length > 0){
            RouteOne = await routeModel.findOne({_id : ticketNumberCarOne[0].trip.route})
        }
        ticketNumberCarOne.forEach((value,index) => {
            if(value.thoigiandat !== null) {
                    booleanOne = value.soghe;
                    
            }                
         });

        if(booleanOne > 0){
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
        let booleanOne = 0;
        // console.log(soghedi)
        // const ticketNumberCarOne = await ticketModel.findOneAndUpdate({
        //     soghe : {
        //       $in: soghedi.map(value => value)
        //      },
        //     trip :  chuyendi
        // }
        // ,   {
        //     trangthaighe : trangthai
        // }   
        // );        
        const resultPromiseOne = await Promise.all(
            soghedi.map((value,index)=>{
                return ticketModel.findOneAndUpdate({trip : chuyendi, soghe : value}, {
                    trangthaighe : trangthai
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

const getTicketOfUser = async(req, res)=>{
    try{
        const manhanvien = req.body.user_id
        const user = await userModel.findOne({manhanvien : manhanvien});
        const getTicket =  await ticketModel.find({user : user._id}).populate('pay').populate('trip');

        
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
        
        const getTicket = await ticketModel.findOne({_id :  id})
        
        const canelTicket = new cancleModel({
            ngayhuy : new Date(),
            chuyenhuy : getTicket.trip,
            soghehuy : getTicket.soghe,
            pay : getTicket.pay

        })
        await canelTicket.save()
        
        const updateTicket =  await ticketModel.findOneAndUpdate({
            _id :  id 
        },
            {
                thoigiandat : null ,
                trangthaighe : "ACTIVE",
                nguoinhan : "",
                sdt : "",
                user : null,
                pay : null
            } 
        ) 
        return res.status(200).json({
            success : true,
            message : "Lấy thông tin thành công",
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
module.exports ={
    getTicketTrip,
    getNumberTicket,
    updateCarNumber,
    updatStatusTicket,
    checkNumberCar,
    checkOutNumberCar,
    getTicketOfUser,
    cancleTicket
}