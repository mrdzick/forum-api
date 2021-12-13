const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class ReplyRepositoryPostgres extends ReplyRepository {
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

    async verifyAvailableReply (replyId) {
        const query = {
            text: 'SELECT id FROM replies WHERE id=$1 AND is_deleted=FALSE',
            values: [replyId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Komentar tidak ditemukan!')
        }
    }

    async verifyReplyOwner (replyId, owner) {
        const query = {
            text: 'SELECT * FROM replies WHERE id=$1 AND owner=$2',
            values: [replyId, owner]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new AuthorizationError('Komentar ini bukan milik anda!')
        }
    }

    async deleteReply (replyId) {
        const query = {
            text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
            values: [replyId]
        }

        await this._pool.query(query)
    }

    async getAllReplies (commentId) {
        const query = {
            text: `SELECT replies.id, replies.content, users.username, replies.comment, replies.date, replies.is_deleted FROM replies
                    LEFT JOIN users ON users.id=replies.owner WHERE replies.comment=$1 ORDER BY replies.date ASC`,
            values: [commentId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }
}

module.exports = ReplyRepositoryPostgres
