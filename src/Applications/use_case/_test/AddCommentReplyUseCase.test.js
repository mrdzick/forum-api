const AddReply = require('../../../Domains/comment-replies/entities/AddReply')
const AddedReply = require('../../../Domains/comment-replies/entities/AddedReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const CommentRepliesRepository = require('../../../Domains/comment-replies/CommentRepliesRepository')
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase')

describe('AddCommentReplyUseCase', () => {
    it('should orchestrating the add reply correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'ini isi komentar',
            owner: 'user-123',
            comment: 'comment-123',
            thread: 'thread-123'
        }

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        })

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockCommentRepliesRepository = new CommentRepliesRepository()

        // mocking needed function
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepliesRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply))

        // creating use case instance
        const getCommentReplyUseCase = new AddCommentReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentRepliesRepository: mockCommentRepliesRepository
        })

        // Action
        const addedReply = await getCommentReplyUseCase.execute(useCasePayload)

        // Assert
        expect(addedReply).toStrictEqual(expectedAddedReply)
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.comment)
        expect(mockCommentRepliesRepository.addReply).toBeCalledWith(new AddReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            comment: useCasePayload.comment,
            thread: useCasePayload.thread
        }))
    })
})
