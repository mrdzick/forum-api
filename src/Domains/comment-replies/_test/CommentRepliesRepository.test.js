const CommentRepliesRepository = require('../CommentRepliesRepository')

describe('CommentRepliesRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const commentRepository = new CommentRepliesRepository()

        await expect(commentRepository.addReply({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
