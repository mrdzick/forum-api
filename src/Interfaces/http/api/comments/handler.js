const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor (container) {
        this._container = container

        this.postCommentToThread = this.postCommentToThread.bind(this)
        this.deleteCommentFromThread = this.deleteCommentFromThread.bind(this)
    }

    async postCommentToThread ({ payload, params, auth }, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const { content } = payload
        const { id: credentialId } = auth.credentials
        const { threadId } = params

        const payloadToSend = { content, owner: credentialId, thread: threadId }
        const addedComment = await addCommentUseCase.execute(payloadToSend)

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            }
        })
        response.code(201)
        return response
    }

    async deleteCommentFromThread ({ params, auth }, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        const { threadId, commentId } = params
        const { id: credentialId } = auth.credentials

        const payloadToSend = { commentId: commentId, thread: threadId, owner: credentialId }

        await deleteCommentUseCase.execute(payloadToSend)

        const response = h.response({
            status: 'success'
        })
        response.code(200)
        return response
    }
}

module.exports = CommentsHandler
