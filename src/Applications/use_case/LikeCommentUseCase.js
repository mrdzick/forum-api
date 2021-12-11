const AddLike = require('../../Domains/likes/entities/AddLike')

class LikeCommentUseCase {
    constructor ({ threadRepository, commentRepository, likeRepository }) {
        this.threadRepository = threadRepository
        this.commentRepository = commentRepository
        this.likeRepository = likeRepository
    }

    async execute (useCasePayload) {
        const { owner, thread, comment } = useCasePayload
        await this.threadRepository.verifyAvailableThread(thread)
        await this.commentRepository.verifyAvailableComment(comment)
        const liked = await this.likeRepository.verifyLikeStatus(comment, owner)
        if (!liked) {
            const like = new AddLike(useCasePayload)
            await this.likeRepository.like(like)
        } else {
            await this.likeRepository.unlike(comment, owner)
        }
    }
}

module.exports = LikeCommentUseCase
