const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
    constructor (pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async like (like) {
        const { owner, comment } = like
        const id = `like-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3)',
            values: [id, owner, comment]
        }

        await this._pool.query(query)
    }

    async verifyLikeStatus (commentId, ownerId) {
        const query = {
            text: 'SELECT * FROM likes WHERE owner=$1 AND comment=$2',
            values: [ownerId, commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            return false
        }
        return true
    }

    async unlike (commentId, ownerId) {
        const query = {
            text: 'DELETE FROM likes WHERE owner=$1 AND comment=$2',
            values: [ownerId, commentId]
        }

        await this._pool.query(query)
    }

    async getAllLikes (commentId) {
        const query = {
            text: 'SELECT * FROM likes WHERE comment=$1',
            values: [commentId]
        }

        const result = await this._pool.query(query)
        return result.rows
    }
}

module.exports = LikeRepositoryPostgres
