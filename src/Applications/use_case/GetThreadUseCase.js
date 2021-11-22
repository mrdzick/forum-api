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

        const formatedComments = comments.map((comment) => {
            if (comment.is_deleted === true) {
                comment.content = '**komentar telah dihapus**'
            }
            return {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content
            }
        })

        thread.comments = formatedComments

        return thread
    }
}

module.exports = GetThreadUseCase
