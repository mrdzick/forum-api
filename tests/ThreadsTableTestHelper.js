/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
    async addThread ({ id = 'thread-123', title = 'test title thread', body = 'test body thread', owner = 'user-123' }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [id, title, body, owner]
        }

        await pool.query(query)
    },

    async findThreadById (threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id=$1',
            values: [threadId]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable () {
        await pool.query('TRUNCATE TABLE threads')
    }
}

module.exports = ThreadsTableTestHelper
