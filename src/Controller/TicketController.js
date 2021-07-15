const ticketModel = require('../Model/TicketModel');
const userModel = require('../Model/UserModel');

const getTicketTrip = async(req , res)=>{
    try{
        const listTicket = await ticketModel.find({trip :  req.query.trip})
        console.log(listTicket);
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

const getNumberTicket =async(req , res)=>{
    try{
        // const loai = req.query.loai;
        const chuyendi = req.query.chuyendi;
        const sovedi = req.query.sovedi;

     
        const ticketOne = ticketModel.find({trip :  chuyendi , soghe : null});
        if(ticketOne.length < sovedi){
            return res.status(400).json({
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
        return res.status(400).json({
            success : false ,
            message : 'Lấy thông tin lỗi',
           
        })
    }
}
// con

module.exports ={
    getTicketTrip,
    getNumberTicket
}