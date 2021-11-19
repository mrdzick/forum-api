const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const InvariantError = require('../../Commons/exceptions/InvariantError')

class CommentRepositoryPostgres extends CommentRepository {
    constructor (pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
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

    async verifyAvailableComment (commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id=$1 AND is_deleted=FALSE',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Komentar tidak ditemukan!')
        }
    }

    async verifyCommentOwner (commentId, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id=$1 AND owner=$2',
            values: [commentId, owner]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new AuthorizationError('Komentar ini bukan milik anda!')
        }
    }

    async deleteComment (commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted=TRUE WHERE id=$1 RETURNING id, is_deleted',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Gagal melakukan penghapusan!')
        }
    }

    async getAllCommentsInThread (threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments
                    LEFT JOIN users ON users.id=comments.owner WHERE comments.thread=$1 ORDER BY comments.date ASC`,
            values: [threadId]
        }

        const resultQuery = await this._pool.query(query)

        const result = resultQuery.rows.map((comment) => {
            if (comment.is_deleted === true) {
                comment.content = '**komentar telah dihapus**'
            }
            return {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content
            }
        })

        return result
    }
}

module.exports = CommentRepositoryPostgres
