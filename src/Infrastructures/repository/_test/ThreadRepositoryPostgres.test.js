const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

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
})
