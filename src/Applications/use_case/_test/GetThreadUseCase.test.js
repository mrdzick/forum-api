const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123'
        }
        const expectedThread = {
            id: 'thread-123',
            title: 'ini title thread'
        }
        const expectedComments = [
            {
                id: 'comment-123'
            }
        ]

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread))
        mockCommentRepository.getAllCommentsInThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComments))

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyAvailableThread)
            .toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.getAllCommentsInThread)
            .toHaveBeenCalledWith(useCasePayload.threadId)
    })
})
