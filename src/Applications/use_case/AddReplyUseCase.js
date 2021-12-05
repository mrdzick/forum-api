const AddReply = require('../../Domains/replies/entities/AddReply')

class AddReplyUseCase {
    constructor ({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async execute (useCasePayload) {
        await this._threadRepository.verifyAvailableThread(useCasePayload.thread)
        await this._commentRepository.verifyAvailableComment(useCasePayload.comment)
        const reply = new AddReply(useCasePayload)
        return this._replyRepository.addReply(reply)
    }
}

module.exports = AddReplyUseCase
