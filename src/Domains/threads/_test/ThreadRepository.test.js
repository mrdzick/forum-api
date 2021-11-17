const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const threadRepository = new ThreadRepository()

        await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(threadRepository.verifyAvailableThread('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
