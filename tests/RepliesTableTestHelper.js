/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
    async addReply ({ id = 'reply-123', content = 'ini adalah isi balasan komentar', owner = 'user-123', comment = 'comment-123', thread = 'thread-123' }) {
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
            values: [id, content, owner, comment, thread]
        }

        await pool.query(query)
    },

    async findReplyById (replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id=$1 AND is_deleted=FALSE',
            values: [replyId]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM replies WHERE 1=1')
    }
}

module.exports = RepliesTableTestHelper
