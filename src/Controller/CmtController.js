const commentModel = require('../Model/CommentModel');
const replyModel = require('../Model/ReplyModel');

const getComment = async(req,res)=>{
    try{
        const listComment = await commentModel.find({ trangthai : { $ne : false}})
        return res.status(200).json({
            success : true ,
            body :listComment
        })
    }
    catch(err){
        console.log(err);
    }
}

const getReply = async(req,res)=>{
    try{
        const listReply = await replyModel.find({ trangthai : { $ne : false}})
        return res.status(200).json({
            success : true ,
            body :listReply
        })
    }
    catch(err){
        console.log(err);
    }
}

const insertComment = async (req,res)=>{
    try{
        const comment = new commentModel(req.body);
        await comment.save();
        return res.status(200).json({
            success : true ,
            body :comment,
            message : 'Thêm thành công !'
        })

    }catch(err){
        console.log(err);
    }
}

const insertReply = async (req,res)=>{
    try{
        console.log(req.body);
        const comment = new replyModel(req.body);
        await comment.save();
        return res.status(200).json({
            success : true ,
            body :comment,
            message : 'Thêm thành công !'
        })

    }catch(err){
        console.log(err);
    }
}

const deleteComment = async (req,res)=>{
    try{
        const comment = await commentModel.findOneAndUpdate({ _id : req.body.id }, { trangthai : false}) 
        const reply = await replyModel.updateMany({comment : req.body.id } , {trangthai : false })
        return res.status(200).json({
            success : true ,
            message : 'Xóa thành công'
        })

    }catch(err){
        console.log(err);
    }
}
const deleteReply = async (req,res)=>{
    try{
        const comment = await replyModel.findOneAndUpdate({ _id : req.body.id }, { trangthai : false}) 
        
        return res.status(200).json({
            success : true ,
            message : 'Xóa thành công'
        })

    }catch(err){
        console.log(err);
    }
}
module.exports = {
    getComment,
    getReply,
    insertReply,
    insertComment,
    deleteComment,
    deleteReply
}