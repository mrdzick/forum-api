const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator')

class CommentsHandler {
    constructor (container) {
        this._container = container

        this.postCommentToThread = this.postCommentToThread.bind(this)
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
}

module.exports = CommentsHandler
