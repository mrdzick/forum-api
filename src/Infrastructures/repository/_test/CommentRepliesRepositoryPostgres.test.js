const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')
// const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
// const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddReply = require('../../../Domains/comment-replies/entities/AddReply')
const AddedReply = require('../../../Domains/comment-replies/entities/AddedReply')
const pool = require('../../database/postgres/pool')
const CommentRepliesRepositoryPostgres = require('../CommentRepliesRepositoryPostgres')

describe('CommentRepliesRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
    })

    afterEach(async () => {
        await CommentRepliesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await pool.end()
    })

    describe('addReply Function', () => {
        it('should persist add reply', async () => {
            // Arrange
            const reply = new AddReply({
                content: 'ini isi balasan komentar',
                owner: 'user-123',
                comment: 'comment-123'
            })

            const fakeIdGenerator = () => '123' // stub
            const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await commentRepliesRepositoryPostgres.addReply(reply)

            // Assert
            const replies = await CommentRepliesTableTestHelper.findReplyById('reply-123')
            expect(replies).toHaveLength(1)
        })

        it('should return added reply correctly', async () => {
            // Arrange
            const reply = new AddReply({
                content: 'ini isi balasan komentar',
                owner: 'user-123',
                comment: 'comment-123'
            })

            const fakeIdGenerator = () => '123' // Stub
            const commentRepliesRepositoryPostgres = new CommentRepliesRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedReply = await commentRepliesRepositoryPostgres.addReply(reply)

            // Assert
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: reply.content,
                owner: reply.owner
            }))
        })
    })

    // describe('verify available comment function', () => {
    //     it('should to throw 404 when comment is not available', async () => {
    //         // Arrange
    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         // Action & Assert
    //         expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError)
    //     })

    //     it('should not throw 404 when comment is available', async () => {
    //         // Arrange
    //         await CommentsTableTestHelper.addComment({})

    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         // Action & Assert
    //         expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError)
    //     })
    // })

    // describe('verify comment owner function', () => {
    //     it('should to throw 403 when wrong owner is trying to access comment', async () => {
    //         // Arrange
    //         const owner = 'user-666'
    //         await CommentsTableTestHelper.addComment({})

    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         // Action & Assert
    //         expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).rejects.toThrowError(AuthorizationError)
    //     })

    //     it('should not throw 403 when correct owner is trying to access their comment', async () => {
    //         // Arrange
    //         const owner = 'user-123'
    //         await CommentsTableTestHelper.addComment({})

    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         // Action & Assert
    //         expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).resolves.not.toThrowError(AuthorizationError)
    //     })
    // })

    // describe('delete comment function', () => {
    //     it('should delete (hide) comment', async () => {
    //         // Arrange
    //         const commentId = 'comment-123'
    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         await CommentsTableTestHelper.addComment({}) // Add default comment with commentId = comment-123

    //         // Action
    //         await commentRepositoryPostgres.deleteComment(commentId) // Delete comment with id = comment-123
    //         const comment = await CommentsTableTestHelper.findCommentById(commentId)

    //         // Assert
    //         expect(comment).toHaveLength(0)
    //     })
    // })

    // describe('getAllCommentsInThread function', () => {
    //     it('should return all comments correctly', async () => {
    //         // Assert
    //         const threadId = 'thread-123'
    //         const expectedResult = {
    //             id: 'comment-123',
    //             username: 'dicoding',
    //             content: 'ini adalah isi komentar'
    //         }
    //         const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

    //         await CommentsTableTestHelper.addComment({}) // add default comment

    //         // Action
    //         const result = await commentRepositoryPostgres.getAllCommentsInThread(threadId)

    //         // Assert
    //         expect(result[0].id).toEqual(expectedResult.id)
    //         expect(result[0].username).toEqual(expectedResult.username)
    //         expect(result[0].content).toEqual(expectedResult.content)
    //         expect(result[0]).toHaveProperty('date')
    //     })
    // })
})
