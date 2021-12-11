const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase')

class LikesHandler {
    constructor (container) {
        this._container = container

        this.putLikeComment = this.putLikeComment.bind(this)
    }

    async putLikeComment ({ params, auth }, h) {
        const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
        const { threadId, commentId } = params
        const { id: credentialId } = auth.credentials

        const payloadToSend = { owner: credentialId, thread: threadId, comment: commentId }

        await likeCommentUseCase.execute(payloadToSend)

        const response = h.response({
            status: 'success'
        })
        response.code(200)
        return response
    }
}

module.exports = LikesHandler
