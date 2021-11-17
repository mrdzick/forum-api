const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentUseCase {
    constructor ({ commentRepository }) {
        this._commentRepository = commentRepository
    }

    async execute (useCasePayload) {
        await this._commentRepository.verifyAvailableThread(useCasePayload.thread)
        const comment = new AddComment(useCasePayload)
        return this._commentRepository.addComment(comment)
    }
}

module.exports = AddCommentUseCase
