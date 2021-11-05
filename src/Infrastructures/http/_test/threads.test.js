const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const payload = {
                title: 'title 1',
                body: 'body 1'
            }
            const userPayload = {
                username: 'dicoding',
                password: 'secret'
            }
            const server = await createServer(container)

            // Add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })
            // Login
            const getAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: userPayload
            })
            const { accessToken } = getAuth.result.data

            // Action
            const response = await server.inject({
                url: '/threads',
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
            expect(responseJson.data.addedThread).toBeDefined()
            expect(responseJson.data.addedThread.title).toEqual(payload.title)
        })

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                body: 'ini body dari threadnya'
            }

            const userPayload = {
                username: 'dicoding',
                password: 'secret'
            }

            const server = await createServer(container)

            // Add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })
            // Login
            const getAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: userPayload
            })
            const { accessToken } = getAuth.result.data

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
            const userPayload = {
                username: 'dicoding',
                password: 'secret'
            }

            const server = await createServer(container)

            // Add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })
            // Login
            const getAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: userPayload
            })
            const { accessToken } = getAuth.result.data

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
            const userPayload = {
                username: 'dicoding',
                password: 'secret'
            }

            const server = await createServer(container)

            // Add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })
            // Login
            const getAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: userPayload
            })
            const { accessToken } = getAuth.result.data

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit')
        })
    })
})
