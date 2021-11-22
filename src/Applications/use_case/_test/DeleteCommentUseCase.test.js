const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
        const useCasePayload = {
            commentId: 'comment-123',
            thread: 'thread-123',
            owner: 'user-123'
        }
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyAvailableComment = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve())

        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Act
        await deleteCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyAvailableThread)
            .toHaveBeenCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.verifyAvailableComment)
            .toHaveBeenCalledWith(useCasePayload.commentId)
        expect(mockCommentRepository.verifyCommentOwner)
            .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner)
        expect(mockCommentRepository.deleteComment)
            .toHaveBeenCalledWith(useCasePayload.commentId)
    })
})
