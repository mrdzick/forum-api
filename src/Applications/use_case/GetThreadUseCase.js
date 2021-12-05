class GetThreadUseCase {
    constructor ({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async execute (useCasePayload) {
        const { threadId } = useCasePayload
        await this._threadRepository.verifyAvailableThread(threadId)
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getAllCommentsInThread(threadId)
        const replies = await this._replyRepository.getAllReplies(threadId)

        const getFormatedReplies = (commentId) => {
            const filteredReplies = replies.filter((reply) => {
                return reply.comment === commentId
            })
            const formatedReplies = filteredReplies.map((reply) => {
                if (reply.is_deleted === true) {
                    reply.content = '**balasan telah dihapus**'
                }
                return {
                    id: reply.id,
                    content: reply.content,
                    date: reply.date,
                    username: reply.username
                }
            })
            return formatedReplies
        }

        thread.comments = comments.map((comment) => {
            if (comment.is_deleted === true) {
                comment.content = '**komentar telah dihapus**'
            }
            return {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content,
                replies: getFormatedReplies(comment.id)
            }
        })

        return thread
    }
}

module.exports = GetThreadUseCase
