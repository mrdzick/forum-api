const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')

class ReplyHandler {
    constructor (container) {
        this._container = container

        this.postReplyToComment = this.postReplyToComment.bind(this)
        this.deleteReplyFromComment = this.deleteReplyFromComment.bind(this)
    }

    async postReplyToComment ({ payload, params, auth }, h) {
        const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name)
        const { content } = payload
        const { id: credentialId } = auth.credentials
        const { threadId, commentId } = params

        const payloadToSend = { content, owner: credentialId, thread: threadId, comment: commentId }
        const addedReply = await addCommentReplyUseCase.execute(payloadToSend)

        const response = h.response({
            status: 'success',
            data: {
                addedReply
            }
        })
        response.code(201)
        return response
    }

    async deleteReplyFromComment ({ params, auth }, h) {
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name)
        const { threadId, commentId, replyId } = params
        const { id: credentialId } = auth.credentials

        const payloadToSend = { id: replyId, comment: commentId, thread: threadId, owner: credentialId }

        await deleteReplyUseCase.execute(payloadToSend)

        const response = h.response({
            status: 'success'
        })
        response.code(200)
        return response
    }
}

module.exports = ReplyHandler
