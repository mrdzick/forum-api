class DeleteReplyUseCase {
    constructor ({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async execute (useCasePayload) {
        const { id, comment, thread, owner } = useCasePayload
        await this._threadRepository.verifyAvailableThread(thread)
        await this._commentRepository.verifyAvailableComment(comment)
        await this._replyRepository.verifyAvailableReply(id)
        await this._replyRepository.verifyReplyOwner(id, owner)
        await this._replyRepository.deleteReply(id)
    }
}

module.exports = DeleteReplyUseCase
