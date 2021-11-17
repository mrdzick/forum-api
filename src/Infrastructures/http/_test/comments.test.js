const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/threadId/comments endpoint', () => {
    describe('when POST /threads/threadId/comments', () => {
        beforeAll(async () => {
            await UsersTableTestHelper.addUser({})
        })
        afterEach(async () => {
            await CommentsTableTestHelper.cleanTable()
            await ThreadsTableTestHelper.cleanTable()
        })

        afterAll(async () => {
            await UsersTableTestHelper.cleanTable()
            await pool.end()
        })
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const payload = {
                content: 'ini isi komentar'
            }

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments',
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
            expect(responseJson.data.addedComment).toBeDefined()
            expect(responseJson.data.addedComment.content).toEqual(payload.content)
        })

        it('should response 404 when adding comment to a thread that is not available', async () => {
            // Assert
            const payload = {
                content: 'ini isi komentar'
            }

            const server = await createServer(container)

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments',
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

        it('should response 400 when adding comment with bad payload', async () => {
            const payload = {
                content: ''
            }

            const server = await createServer(container)

            await ThreadsTableTestHelper.addThread({}) // Add a thread

            const accessToken = await ServerTestHelper.getAccessToken()
            // Action
            const response = await server.inject({
                url: '/threads/thread-123/comments',
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
