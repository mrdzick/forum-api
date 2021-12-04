const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')

class ThreadsHandler {
    constructor (container) {
        this._container = container

        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
    }

    async postThreadHandler ({ payload, auth }, h) {
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
    }

    async getThreadByIdHandler ({ params }, h) {
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
        const { threadId } = params
        const threadInfo = await getThreadUseCase.execute({ threadId })

        const response = h.response({
            status: 'success',
            data: {
                thread: threadInfo
            }
        })
        response.code(200)
        return response
    }
}

module.exports = ThreadsHandler
