class GetThreadUseCase {
    constructor ({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute (useCasePayload) {
        const { threadId } = useCasePayload
        await this._threadRepository.verifyAvailableThread(threadId)
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getAllCommentsInThread(threadId)

        thread.comments = comments

        return thread
    }
}

module.exports = GetThreadUseCase
