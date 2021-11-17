class DeleteCommentUseCase {
    constructor ({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute (useCasePayload) {
        const { commentId, thread, owner } = useCasePayload
        await this._threadRepository.verifyAvailableThread(thread)
        await this._commentRepository.verifyAvailableComment(commentId)
        await this._commentRepository.verifyCommentOwner(commentId, owner)
        await this._commentRepository.deleteComment(commentId)
    }
}

module.exports = DeleteCommentUseCase
