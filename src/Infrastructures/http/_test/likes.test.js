const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
    })
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await LikesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable()
        await pool.end()
    })
    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200', async () => {
            // Arrange
            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread
            await CommentsTableTestHelper.addComment({}) // Add a comment

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/likes',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
        it('should response 404 when trying to like a comment that is not available', async () => {
            // Assert
            const server = await createServer(container)

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/likes',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
    })
})
