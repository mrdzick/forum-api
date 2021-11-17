const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'ini isi komentar',
            owner: 'user-123',
            thread: 'thread-123'
        }

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        })

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment))

        // creating use case instance
        const getCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        })

        // Action
        const addedComment = await getCommentUseCase.execute(useCasePayload)

        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            thread: useCasePayload.thread
        }))
    })
})
