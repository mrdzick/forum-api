const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await pool.end()
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

    describe('verify available comment function', () => {
        it('should to throw 404 when comment is not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError)
        })

        it('should not throw 404 when comment is available', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('verify comment owner function', () => {
        it('should to throw 403 when wrong owner is trying to access comment', async () => {
            // Arrange
            const owner = 'user-666'
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).rejects.toThrowError(AuthorizationError)
        })

        it('should not throw 403 when correct owner is trying to access their comment', async () => {
            // Arrange
            const owner = 'user-123'
            await CommentsTableTestHelper.addComment({})

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).resolves.not.toThrowError(AuthorizationError)
        })
    })

    describe('delete comment function', () => {
        it('should delete (hide) comment', async () => {
            // Arrange
            const commentId = 'comment-123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            await CommentsTableTestHelper.addComment({}) // Add default comment with commentId = comment-123

            // Action
            await commentRepositoryPostgres.deleteComment(commentId) // Delete comment with id = comment-123
            const comment = await CommentsTableTestHelper.findCommentById(commentId)

            // Assert
            expect(comment).toHaveLength(0)
        })
    })

    describe('getAllCommentsInThread function', () => {
        it('should return all comments correctly', async () => {
            // Assert
            const threadId = 'thread-123'
            const expectedResult = {
                id: 'comment-123',
                username: 'dicoding',
                content: 'ini adalah isi komentar'
            }
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            await CommentsTableTestHelper.addComment({}) // add default comment

            // Action
            const result = await commentRepositoryPostgres.getAllCommentsInThread(threadId)

            // Assert
            expect(result[0].id).toEqual(expectedResult.id)
            expect(result[0].username).toEqual(expectedResult.username)
            expect(result[0].content).toEqual(expectedResult.content)
            expect(result[0]).toHaveProperty('date')
        })

        it('should return comments with content=**komentar telah dihapus** when comments has been deleted', async () => {
            // Arrange
            const threadId = 'thread-123'
            const expectedContent = '**komentar telah dihapus**'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            await CommentsTableTestHelper.addComment({}) // add default comment

            // Action
            await CommentsTableTestHelper.softDeleteComment('comment-123') // soft delete comment with id comment-123
            const result = await commentRepositoryPostgres.getAllCommentsInThread(threadId)

            // Assert
            expect(result[0].content).toEqual(expectedContent)
        })
    })
})
