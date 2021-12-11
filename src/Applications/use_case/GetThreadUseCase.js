class GetThreadUseCase {
    constructor ({ threadRepository, commentRepository, replyRepository, likeRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
        this._likeRepository = likeRepository
    }

    async execute (useCasePayload) {
        const { threadId } = useCasePayload
        await this._threadRepository.verifyAvailableThread(threadId)
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getAllCommentsInThread(threadId)

        thread.comments = await Promise.all(comments.map(async (comment) => {
            const replies = await this._replyRepository.getAllReplies(comment.id)
            const likes = await this._likeRepository.getAllLikes(comment.id)
            if (comment.is_deleted === true) {
                comment.content = '**komentar telah dihapus**'
                return {
                    id: comment.id,
                    username: comment.username,
                    date: comment.date,
                    content: comment.content
                }
            }
            return {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content,
                replies: replies.map((reply) => {
                    if (reply.is_deleted === true) {
                        reply.content = '**balasan telah dihapus**'
                    }
                    return {
                        id: reply.id,
                        content: reply.content,
                        date: reply.date,
                        username: reply.username
                    }
                }),
                likeCount: likes.length
            }
        }))

        return thread
    }
}

module.exports = GetThreadUseCase
