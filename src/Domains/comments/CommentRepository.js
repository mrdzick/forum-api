class CommentRepository {
    async addComment (comment) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyAvailableThread (threadId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = CommentRepository
