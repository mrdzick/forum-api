const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await pool.end()
    })

    describe('verifyAvailableThread', () => {
        it('should throw NotFoundError when thread is not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError)
        })

        it('should not throw error when thread is available', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({}) // Add Thread //

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('addComment Function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const comment = new AddComment({
                content: 'ini isi komentar',
                owner: 'user-123',
                thread: 'thread-123'
            })

            const fakeIdGenerator = () => '123' // stub
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await commentRepositoryPostgres.addComment(comment)

            // Assert
            const comments = await CommentsTableTestHelper.findCommentById('comment-123')
            expect(comments).toHaveLength(1)
        })

        it('should return added comment correctly', async () => {
            // Arrange
            const comment = new AddComment({
                content: 'ini isi komentar',
                owner: 'user-123',
                thread: 'thread-123'
            })

            const fakeIdGenerator = () => '123' // Stub
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(comment)

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: comment.content,
                owner: comment.owner
            }))
        })
    })
})
