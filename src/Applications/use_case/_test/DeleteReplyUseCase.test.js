const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'reply-123',
            content: 'ini balasan komentar',
            comment: 'comment-123',
            thread: 'thread-123',
            owner: 'user-123'
        }
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyAvailableComment = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockReplyRepository.verifyAvailableReply = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve())

        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        // Act
        await deleteReplyUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyAvailableThread)
            .toHaveBeenCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.verifyAvailableComment)
            .toHaveBeenCalledWith(useCasePayload.comment)
        expect(mockReplyRepository.verifyAvailableReply)
            .toHaveBeenCalledWith(useCasePayload.id)
        expect(mockReplyRepository.verifyReplyOwner)
            .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.owner)
        expect(mockReplyRepository.deleteReply)
            .toHaveBeenCalledWith(useCasePayload.id)
    })
})
