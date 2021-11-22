const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123'
        }
        const thread = {
            id: 'thread-123',
            title: 'ini title thread',
            body: 'ini body thread',
            date: '20201010',
            username: 'mrdzick'
        }
        const comments = [
            {
                id: 'comment-123',
                username: 'mrdzick',
                date: '20211010',
                content: 'ini konten'
            }
        ]

        const expectedThread = {
            id: 'thread-123',
            title: 'ini title thread',
            body: 'ini body thread',
            date: '20201010',
            username: 'mrdzick',
            comments: [
                {
                    id: 'comment-123',
                    username: 'mrdzick',
                    date: '20211010',
                    content: 'ini konten'
                }
            ]
        }

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getAllCommentsInThread = jest.fn()
            .mockImplementation(() => Promise.resolve(comments))

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const actualGetThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(actualGetThread).toEqual(expectedThread)
        expect(mockThreadRepository.verifyAvailableThread)
            .toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.getAllCommentsInThread)
            .toHaveBeenCalledWith(useCasePayload.threadId)
    })
    it('should return comments with content=**komentar telah dihapus** when comments has been deleted', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123'
        }
        const thread = {
            id: 'thread-123',
            title: 'ini title thread',
            body: 'ini body thread',
            date: '20201010',
            username: 'mrdzick'
        }
        const comments = [
            {
                id: 'comment-123',
                username: 'mrdzick',
                date: '20211010',
                content: 'ini konten',
                is_deleted: true
            }
        ]

        const expectedThread = {
            id: 'thread-123',
            title: 'ini title thread',
            body: 'ini body thread',
            date: '20201010',
            username: 'mrdzick',
            comments: [
                {
                    id: 'comment-123',
                    username: 'mrdzick',
                    date: '20211010',
                    content: '**komentar telah dihapus**'
                }
            ]
        }

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getAllCommentsInThread = jest.fn()
            .mockImplementation(() => Promise.resolve(comments))

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const actualGetThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(actualGetThread).toEqual(expectedThread)
    })
})
