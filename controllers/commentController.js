const router = express.Router()
const { Comment, Like } = require('../models')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const { celebrate, Segments } = require('celebrate')
const { CommentSerializer } = require('../serializers')

router.get('/:comment_id', isAuthenticated, async (req, res) => {
    try{
        let comment_id = req.params.comment_id
        let comment = await Comment.findOne({
            CommentId: comment_id
        })
        if (comment !== null) {
            return res.json({success: true, replies: comment.getReplies()}).end()
        }
        return res.status(404).json({success: false, message: "Comment does not exist or has been deleted"}).end()

    }
    catch(err){
        console.log(err)
        return res.status(500).json({success: false}).end()
    }
})

router.post('/:comment_id', [
    celebrate({
        [Segments.BODY]: CommentSerializer
    }), isAuthenticated], async(req, res) => {
    try{
        let { caption } = req.body.caption
        let comment = await Comment.create({
            CommentId: comment_id,
            caption: caption,
            UserId: req.user.id
        })
        return res.json({success: true, message: "successfully created comment"})
    }

    catch(err){
        console.log(err)
        return res.status(500).json({success: false}).end()
    }
})

router.post('/:comment_id/likes', isAuthenticated, async (req, res) => {
    try{
        let comment_id = req.params.comment_id
        let comment = await Post.findOne({
            where: {
                id: comment_id
            }
        })
        if(comment === null){
            return res.status(404).json({success: false, message: "comment has been deleted or could not be found"}).end()
        }
        let like = await Like.findOne({
            where: {
                CommentId: comment_id,
                UserId: req.user.id
            }
        })
        if(like === null){
            await Like.create({
                CommentId: comment_id,
                UserId: req.user.id
            }).catch((err) => console.log(err))
            return res.end(JSON.stringify({ liked: true }))
        }
        await Like.destroy({
            where: {
                CommentId: comment_id,
                UserId: req.user.id
            }
        })
        return res.end(JSON.stringify({ liked: false }))     
    }
    catch(err){
        return res.status(500).json({ success: false }).end()
    }
})