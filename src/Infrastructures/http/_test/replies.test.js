const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
    })
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await CommentRepliesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable()
        await pool.end()
    })
    describe('when POST /threads/threadId/comments/{commentId}/replies', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const payload = {
                content: 'ini isi balasan komentar'
            }

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread
            await CommentsTableTestHelper.addComment({}) // Add a comment

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/replies',
                method: 'POST',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedReply).toBeDefined()
            expect(responseJson.data.addedReply.content).toEqual(payload.content)
        })

        it('should response 404 when adding a reply to a comment in thread that is not available', async () => {
            // Assert
            const payload = {
                content: 'ini isi balasan komentar'
            }

            const server = await createServer(container)

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/replies',
                method: 'POST',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })

        it('should response 404 when adding a reply to a comment that is not available', async () => {
            // Assert
            const payload = {
                content: 'ini isi balasan komentar'
            }

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/replies',
                method: 'POST',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })

        it('should response 400 when adding reply with bad payload', async () => {
            const payload = {
                content: ''
            }

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread
            await CommentsTableTestHelper.addComment({}) // Add a comment

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/replies',
                method: 'POST',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
        })
    })
})
