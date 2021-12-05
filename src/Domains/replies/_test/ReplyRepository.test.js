const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const replyRepository = new ReplyRepository()

        await expect(replyRepository.addReply({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.deleteReply({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.verifyAvailableReply({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.verifyReplyOwner({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.getAllReplies({})).rejects.toThrowError('COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
