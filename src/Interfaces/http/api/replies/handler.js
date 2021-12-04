const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase')

class RepliesHandler {
    constructor (container) {
        this._container = container

        this.postReplyToComment = this.postReplyToComment.bind(this)
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
}

module.exports = RepliesHandler
