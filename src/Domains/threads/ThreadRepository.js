class ThreadRepository {
    async addThread (thread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyAvailableThread (threadId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = ThreadRepository
