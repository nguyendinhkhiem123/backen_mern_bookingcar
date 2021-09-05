const voteModel = require('../Model/VoteModel')
const getVote = async(req,res)=>{
    try{
        const listVote = await voteModel.find({ trangthai : { $ne : false}}).populate('customer')
        return res.status(200).json({
            success : true ,
            body :listVote
        })
    }
    catch(err){
        console.log(err);
    }
}

const insertVote = async (req,res)=>{
    try{

        const user_id = req.body.user_id;
        const voteFind = await voteModel.findOne({customer : user_id});
        if(voteFind){
            await voteModel.findOneAndDelete({customer : user_id});
        }
        const comment = new voteModel(req.body);
        await comment.save();
        const vote = await voteModel.findOne({_id : comment._id}).populate('customer');
        return res.status(200).json({
            success : true ,
            body :vote,
            message : 'Thêm thành công !'
        })

    }catch(err){
        console.log(err);
    }
}

const deleteVote = async (req,res)=>{
    try{
        const comment = await voteModel.findOneAndDelete({ _id : req.body.id }) 
        
        return res.status(200).json({
            success : true ,
            message : 'Xóa thành công'
        })

    }catch(err){
        console.log(err);
    }
}

const getStatic = async(req,res)=>{
    try{
        const listVote = await voteModel.find({trangthai : true});

        let sum = 0;

        const list = [
            {
                sosao : 1,
                num : 0
            },
            {
                sosao : 2,
                num : 0
            },
            {
                sosao : 3,
                num : 0
            },
            {
                sosao : 4,
                num : 0
            },
            {
                sosao : 5,
                num : 0
            },
        ];
        if(listVote.length > 0 ){
            listVote.forEach(value=>{
                sum+=value.sosao
            })
            sum = sum/listVote.length;
            console.log(sum);
            listVote.forEach((value,index)=>{
                const heso = checkUnquine(list , value.sosao)
                if(heso > -1){
                    const num = list[heso].num + 1
                    list[heso].num = num
                }
            })
        }
        
        return res.status(200).json({
            success : true ,
            body : {
                sum,
                list
            }
        })

    }catch(err){
        console.log(err);
    }
}

const checkUnquine = (list , s)=>{
    let index = -1;
    list.forEach((value,inde)=>{
        if(value.sosao === s) return index = inde; 
    })
    return index;
}
module.exports = {
    getVote,
    getStatic,
    insertVote,
    deleteVote,
  
}