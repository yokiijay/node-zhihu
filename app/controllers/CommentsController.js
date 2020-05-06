const CommentModel = require('../models/CommentModel')

class CommentsController {
  async checkCommentExist(ctx, next){
    const comment = await CommentModel.findById(ctx.params.commentId)
    if(!comment) ctx.throw(404, '评论不存在')
    await next()
  }

  async createComment(ctx){
    const { content } = ctx.request.body
    const { questionId, answerId } = ctx.params
    const { rootCommentId } = ctx.query
    const comment = await new CommentModel({
      content,
      questionId,
      answerId,
      commentator: ctx.state.user._id,
      rootCommentId,
      replyTo: ctx.state.user._id
    }).save()
    ctx.body = comment
  }

  async getComments(ctx){
    const { questionId, answerId } = ctx.params
    let { page=1, perPage=10 } = ctx.query
    const { rootCommentId } = ctx.query

    page = Math.max(page, 1)
    perPage = Math.max(perPage, 1)

    const comments = await CommentModel.find({
      questionId,
      answerId,
      rootCommentId
    }).populate('commentator replyTo').limit(perPage).skip(perPage*(page-1))

    const count = await CommentModel.estimatedDocumentCount()

    if(!comments) ctx.throw(404, '暂无评论')
f
    ctx.body = {
      comments,
      page,
      hasMore: page*perPage < count
    }
  }

  async deleteComment(ctx){
    const { questionId, answerId, commentId } = ctx.params
    const comment = await CommentModel.findById(commentId).populate('commentator')
    if(!comment) ctx.throw(403, '评论不存在')
    if(comment.commentator._id.toString() !== ctx.state.user._id) ctx.throw(401, '没有权限')
    
    await comment.remove()
    ctx.status = 204
  }
}

module.exports = new CommentsController()