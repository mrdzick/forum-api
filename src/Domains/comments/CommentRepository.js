class CommentRepository {
    async addComment (comment) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyAvailableComment (commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyCommentOwner (commentId, owner) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteComment (commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = CommentRepository
