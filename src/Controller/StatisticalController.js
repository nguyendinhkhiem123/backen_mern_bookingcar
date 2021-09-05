const tripModel = require('../Model/TripModel');
const routeModel = require('../Model/RouteModel');
const ticketModel = require('../Model/TicketModel');
const Money = async(req , res)=>{
    try {
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })

        const matuyen = req.query.matuyen;
        const nambatdau = req.query.nambatdau;
        const namketthuc = req.query.namketthuc;

        // const batdau = new Date(Date.UTC(nambatdau , 0 ,1))
        // const ketthuc = new Date(Date.UTC(namketthuc , 11 ,30));
        const batdau = new Date(nambatdau)
        const ketthuc = new Date(namketthuc);
        let result = [];

        // if(matuyen === 'all'){
        //     result = await tripModel.find({
        //         $and: [
        //            { 
        //                 ngaydi : { $gte : batdau }
        //            },
        //            {
        //                 ngaydi : { $lte :  ketthuc }
        //            },
        //            {
        //                trangthai : 'HOANTHANH'
        //            }
        //         ]
        //     })
          
        // }
        // else{
        //     const route = await routeModel.find({ matuyen : matuyen })
        //     result = await tripModel.find({
        //         $and: [
        //            { 
        //                 ngaydi : { $gte : batdau }
        //            },
        //            {
        //                 ngaydi : { $lte :  ketthuc }
        //            },
        //            {
        //                $or: [ { route : route[0]._id }, { route : route[1]._id  } ]
        //            },
        //            {
        //                  trangthai : 'HOANTHANH'
        //            }
        //         ] 
        //     })
        // }

       
        // listResult = [];
        //     for(let i = 0 ; i < result.length ; i++){
        //         const listTicket = await ticketModel.find({trip : result[i]._id , trangthai : {$ne : 'DAHUY'}});
        //         const sum = sumTicket(listTicket , result[i].giave);
        //         const month = result[i].ngaydi.toString().slice(4,7); 
        //         const year = result[i].ngaydi.toString().slice(11,15);
        //         const date = month + " " + year 
        //         const heso = checkUnquie(listResult,date);
        //         if( heso > -1){
                   
        //             listResult[heso].value += sum;
        //         }
        //         else{
                    
        //             listResult.push({{
        //                 year : date,
        //                 value : sum
        //             })
        //         }
        //     }

        const listTicket = await ticketModel.find({trangthaive : 'DADAT' }).populate('trip');
        
        let sum = 0;
        console.log(batdau , ketthuc)
        if(listTicket.length > 0){
            for(let i = 0 ; i < listTicket.length ; i++){
                const ngaydat = new Date(listTicket[i].thoigiandat);     
                const dateNgayDat = new Date(Date.UTC(ngaydat.getFullYear() , ngaydat.getMonth(), ngaydat.getDate()));
                console.log(dateNgayDat)
                if(dateNgayDat >= batdau && dateNgayDat <= ketthuc){
                    console.log('hello');
                    sum+= listTicket[i].trip.giave;
                }
            }
          
        }
        return res.status(200).json({
            success : true,
            body : sum,
            message : 'Thống kê thành công'
        })
    
    } catch (error) {
        console.log(error);
    }
}

const Trip = async(req , res)=>{
    try {
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })

        const matuyen = req.query.matuyen;
        const nambatdau = req.query.nambatdau;
        const namketthuc = req.query.namketthuc;

        const batdau = new Date(nambatdau)
        const ketthuc = new Date(namketthuc);
        
        let result = [];
        const listTrip = await tripModel.find({trangthai : {$ne : 'DAHUY'}}).populate('route');

        if(listTrip.length > 0 ){
            for(let i = 0 ; i < listTrip.length ; i++){
               
                const listTicket = await ticketModel.find({trip : listTrip[i]._id , trangthaive : 'DADAT'}).populate('trip');
                if(listTicket.length > 0){
                    for(let j = 0 ; j < listTicket.length ; j++){
                        const matuyen = `${listTrip[i].route.noidi}-${listTrip[i].route.noiden}`
                        const ngaydat = new Date(listTicket[j].thoigiandat);     
                        const dateNgayDat = new Date(Date.UTC(ngaydat.getFullYear() , ngaydat.getMonth(), ngaydat.getDate()));
                        if(dateNgayDat >= batdau && dateNgayDat <= ketthuc){
                            const k = checkUnquie(result,matuyen)
                            if(k > -1){
                           
                                let tien = result[k].tien + listTicket[j].trip.giave;
                                console.log(tien);
                                result[k].tien = tien;

                            }
                            else{
                                result.push({
                                    matuyen : matuyen,
                                    tien : listTicket[j].trip.giave
                                })
                            }
                        }
                    }
                }
            }
        
        }
    
        return res.status(200).json({
                success : true ,
                message : 'Thông kế thành công',
                body : result
        })
        
    } catch (error) {
        console.log(error);
    }
}

const Car = async(req , res)=>{
    try {
        const vaitro = req.body.vaitro;
        if(vaitro === 0) return res.status(200).json({
            success : false ,
            messgae : "Bạn không có quyền sửa"
        })

        const matuyen = req.query.matuyen;
        const nambatdau = req.query.nambatdau;
        const namketthuc = req.query.namketthuc;
       
        // const batdau = new Date(Date.UTC(nambatdau , 0 ,1))
        // const ketthuc = new Date(Date.UTC(namketthuc , 11 ,30));
        const batdau = new Date(nambatdau)
        const ketthuc = new Date(namketthuc);
        
        let result = [];

        if(matuyen === 'all'){
            result = await tripModel.find({
                $and: [
                   { 
                        ngaydi : { $gte : batdau }
                   },
                   {
                        ngaydi : { $lte :  ketthuc }
                   },
                   {
                    trangthai : 'HOANTHANH'
                  }
                ]
            }).populate('car');
          
        }
        else{
            const route = await routeModel.find({ matuyen : matuyen })
            result = await tripModel.find({
                $and: [
                   { 
                        ngaydi : { $gte : batdau }
                   },
                   {
                        ngaydi : { $lte :  ketthuc }
                   },
                   {
                       $or: [ { route : route[0]._id }, { route : route[1]._id  } ]
                   },
                   {
                    trangthai : 'HOANTHANH'
                  }
                ] 
            }).populate('car')
        }

        if(result.length > 0 ){
            listResult = [];
            for(let i = 0 ; i < result.length ; i++){
                const car = result[i].car.biensoxe;
               
                const heso = checkUnquieCar(listResult ,car);
                if( heso > -1){
                  
                    listResult[heso].value += 1;
                }
                else{
                    
                    listResult.push({
                        car,
                        value : 1
                    })
                }
            }
         
            return res.status(200).json({
                success : true ,
                body : listResult
            })
    
        }
        else{
            return res.status(200).json({
                success : false ,
                message : 'Không thể thống kê , Vui lòng chọn lại móc thời gian'
            })
        }
    } catch (error) {
        console.log(error);
    }
}


const sumTicket = (list , heso)=>{
    let sum = 0 ;
    list.forEach(value =>{
        if(value.tienphat > 0 ){
            sum += tienphat
        }
        else{
            sum += heso
        }
    })
    return sum
}

const checkUnquie = (list , s)=>{
    let index = -1;
    for(let i = 0 ; i < list.length ; i++){
        if(list[i].matuyen === s) {
            index = i 
            break;
        }
    }
    return index;
}
const checkUnquieCar = (list , s)=>{
    let index = -1;
    for(let i = 0 ; i < list.length ; i++){
        if(list[i].car === s) {
            index = i 
            break;
        }
    }
    return index;
}
module.exports = {
    Money,
    Trip,
    Car
}