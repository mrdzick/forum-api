class ReplyRepository {
    async addReply (reply) {
        throw new Error('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteReply (id) {
        throw new Error('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyAvailableReply (id) {
        throw new Error('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyReplyOwner (id, owner) {
        throw new Error('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getAllReplies (commentId) {
        throw new Error('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = ReplyRepository
