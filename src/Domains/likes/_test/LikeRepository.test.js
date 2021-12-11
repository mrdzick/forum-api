const LikeRepository = require('../LikeRepository')

describe('LikeRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const likeRepository = new LikeRepository()

        await expect(likeRepository.like({})).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.unlike({})).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.verifyLikeStatus({})).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
