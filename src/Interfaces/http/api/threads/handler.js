const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator')

class ThreadsHandler {
    constructor (container) {
        this._container = container

        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.postCommentToThread = this.postCommentToThread.bind(this)
    }

    async postThreadHandler ({ payload, auth }, h) {
        try {
            const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
            const { title, body } = payload
            const { id: credentialId } = auth.credentials
            const payloadToSend = { title, body, owner: credentialId }
            const addedThread = await addThreadUseCase.execute(payloadToSend)

            const response = h.response({
                status: 'success',
                data: {
                    addedThread
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

    async postCommentToThread ({ payload, params, auth }, h) {
        try {
            const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
            const { content } = payload
            const { id: credentialId } = auth.credentials
            const { threadId } = params.threadId

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

module.exports = ThreadsHandler
