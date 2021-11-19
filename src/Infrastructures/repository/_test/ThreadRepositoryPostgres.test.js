const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({})
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable()
        await pool.end()
    })

    describe('verifyAvailableThread', () => {
        it('should throw NotFoundError when thread is not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action & Assert
            expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError)
        })

        it('should not throw error when thread is available', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({}) // Add Thread //

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action & Assert
            expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('addThread Function', () => {
        it('should persist add thread', async () => {
            // Arrange
            const thread = new AddThread({
                title: 'title for test thread in postgres',
                body: 'body for test thread in postgres',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '123' // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(thread)

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123')
            expect(threads).toHaveLength(1)
        })

        it('should return added thread correctly', async () => {
            // Arrange
            const thread = new AddThread({
                title: 'title for test thread in postgres',
                body: 'body for test thread in postgres',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '123' // Stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(thread)

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'title for test thread in postgres',
                owner: 'user-123'
            }))
        })
    })

    describe('getThreadById function', () => {
        it('should return thread value correctly', async () => {
            // Arrange
            const threadId = 'thread-123'
            const expectedResult = {
                id: 'thread-123',
                title: 'test title thread',
                body: 'test body thread',
                username: 'dicoding'
            }
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
            await ThreadsTableTestHelper.addThread({}) // Add Thread with default value

            // Action
            const result = await threadRepositoryPostgres.getThreadById(threadId)

            // Assert
            expect(result.id).toEqual(expectedResult.id)
            expect(result.title).toEqual(expectedResult.title)
            expect(result.body).toEqual(expectedResult.body)
            expect(result.username).toEqual(expectedResult.username)
        })
    })
})
