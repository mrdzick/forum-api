const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
// const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
// const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddLike = require('../../../Domains/likes/entities/AddLike')
// const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const pool = require('../../database/postgres/pool')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')

describe('LikeRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
    })

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await pool.end()
    })

    describe('like Function', () => {
        it('should persist add like', async () => {
            // Arrange
            const like = new AddLike({
                comment: 'comment-123',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '123' // stub
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await likeRepositoryPostgres.like(like)

            // Assert
            const likes = await LikesTableTestHelper.findLikebyId('like-123')
            expect(likes).toHaveLength(1)
        })
    })

    describe('verifyLikeStatus function', () => {
        it('should return false when data is not available', async () => {
            // Arrange
            const commentId = 'comment-123'
            const userId = 'user-123'
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

            // Action
            const liked = await likeRepositoryPostgres.verifyLikeStatus(commentId, userId)

            // Assert
            expect(liked).toEqual(false)
        })

        it('should return true when data is available', async () => {
            // Arrange
            const commentId = 'comment-123'
            const userId = 'user-123'
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

            // Action
            await LikesTableTestHelper.addLike({}) // add like with default data
            const liked = await likeRepositoryPostgres.verifyLikeStatus(commentId, userId)

            // Assert
            expect(liked).toEqual(true)
        })
    })

    describe('unlike function', () => {
        it('should delete like data', async () => {
            // Arrange
            const id = 'like-123'
            const ownerId = 'user-123'
            const commentId = 'comment-123'
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

            await LikesTableTestHelper.addLike({}) // Add a default like

            // Action
            await likeRepositoryPostgres.unlike(commentId, ownerId) // Delete reply with id = reply-123
            const reply = await LikesTableTestHelper.findLikebyId(id)

            // Assert
            expect(reply).toHaveLength(0)
        })
    })
})
