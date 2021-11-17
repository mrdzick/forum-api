const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class CommentRepositoryPostgres extends CommentRepository {
    constructor (pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async verifyAvailableThread (threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id=$1',
            values: [threadId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Thread tidak ada!')
        }
    }

    async addComment (comment) {
        const { content, owner, thread } = comment
        const id = `comment-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, thread]
        }

        const result = await this._pool.query(query)

        return new AddedComment({ ...result.rows[0] })
    }
}

module.exports = CommentRepositoryPostgres
