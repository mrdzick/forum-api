const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator')

class CommentsHandler {
    constructor (container) {
        this._container = container

        this.postCommentToThread = this.postCommentToThread.bind(this)
        this.deleteCommentFromThread = this.deleteCommentFromThread.bind(this)
    }

    async postCommentToThread ({ payload, params, auth }, h) {
        try {
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
        } catch (error) {
            const translatedError = DomainErrorTranslator.translate(error)

            const response = h.response({
                status: 'fail',
                message: translatedError.message
            })
            response.code(translatedError.statusCode)
            return response
        }
    }

    async deleteCommentFromThread ({ params, auth }, h) {
        try {
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
        } catch (error) {
            const translatedError = DomainErrorTranslator.translate(error)

            const response = h.response({
                status: 'fail',
                message: translatedError.message
            })
            response.code(translatedError.statusCode)
            return response
        }
    }
}

module.exports = CommentsHandler
