const CommentRepliesRepository = require('../../Domains/comment-replies/CommentRepliesRepository')
const AddedReply = require('../../Domains/comment-replies/entities/AddedReply')

class CommentRepliesRepositoryPostgres extends CommentRepliesRepository {
    constructor (pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addReply (reply) {
        const { content, owner, comment } = reply

        const id = `reply-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, comment]
        }

        const result = await this._pool.query(query)

        return new AddedReply({ ...result.rows[0] })
    }
}

module.exports = CommentRepliesRepositoryPostgres
