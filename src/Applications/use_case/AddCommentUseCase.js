const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentUseCase {
    constructor ({ commentRepository }) {
        this._commentRepository = commentRepository
    }

    async execute (useCasePayload) {
        const comment = new AddComment(useCasePayload)
        return this._commentRepository.addComment(comment)
    }
}

module.exports = AddCommentUseCase
