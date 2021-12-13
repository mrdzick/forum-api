const AddReply = require('../../../Domains/replies/entities/AddReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReplyUseCase = require('../AddReplyUseCase')

describe('AddReplyUseCase', () => {
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
        const mockReplyRepository = new ReplyRepository()

        // mocking needed function
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve())
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply))

        // creating use case instance
        const getCommentReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        // Action
        const addedReply = await getCommentReplyUseCase.execute(useCasePayload)

        // Assert
        expect(addedReply).toStrictEqual(expectedAddedReply)
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.comment)
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            comment: useCasePayload.comment
        }))
    })
})
