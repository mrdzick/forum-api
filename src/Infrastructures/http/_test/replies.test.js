const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
    })
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
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

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 404 when trying to delete reply where thread is not available', async () => {
            // Arrange
            const threadId = 'thread-666'
            const commentId = 'comment-123'
            const replyId = 'reply-123'

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a default thread
            await CommentsTableTestHelper.addComment({}) // Add a default comment
            await RepliesTableTestHelper.addReply({}) // Add a default reply

            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
        it('should response 404 when trying to delete reply where comment is not available', async () => {
            // Arrange
            const threadId = 'thread-123'
            const commentId = 'comment-666'
            const replyId = 'reply-123'

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a default thread
            await CommentsTableTestHelper.addComment({}) // Add a default comment
            await RepliesTableTestHelper.addReply({}) // Add a default reply

            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
        it('should response 404 when trying to delete reply where reply is not available', async () => {
            // Arrange
            const threadId = 'thread-123'
            const commentId = 'comment-123'
            const replyId = 'reply-123'

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a default thread
            await CommentsTableTestHelper.addComment({}) // Add a default comment

            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
        })
        it('should response 200 when success deleted reply', async () => {
            // Arrange
            const threadId = 'thread-123'
            const commentId = 'comment-123'
            const replyId = 'reply-123'

            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})
            await RepliesTableTestHelper.addReply({})

            const server = await createServer(container)

            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
    })
})
