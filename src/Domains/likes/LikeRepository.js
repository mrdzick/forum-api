class LikeRepository {
    async like (like) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async unlike (like) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyLikeStatus (commentId, ownerId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getAllLikes (commentId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = LikeRepository
