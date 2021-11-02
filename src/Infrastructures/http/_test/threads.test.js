const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({})
    })

    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'dicoding thread',
                body: 'ini body dari threadnya',
                owner: 'user-123'
            }
            // eslint-disable-next-line no-undef
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'dicoding thread',
                body: 'ini body dari threadnya'
            }
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 123,
                body: true,
                owner: 'user-123'
            }
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
        })

        it('should response 400 when title more than 50 character', async () => {
            // Arrange
            const requestPayload = {
                title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
                body: 'ini body thread',
                owner: 'user-123'
            }
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit')
        })
    })
})
