const AddReply = require('../../Domains/comment-replies/entities/AddReply')

class AddCommentReplyUseCase {
    constructor ({ threadRepository, commentRepository, commentRepliesRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._commentRepliesRepository = commentRepliesRepository
    }

    async execute (useCasePayload) {
        await this._threadRepository.verifyAvailableThread(useCasePayload.thread)
        await this._commentRepository.verifyAvailableComment(useCasePayload.comment)
        const reply = new AddReply(useCasePayload)
        return this._commentRepliesRepository.addReply(reply)
    }
}

module.exports = AddCommentReplyUseCase
