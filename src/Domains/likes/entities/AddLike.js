class AddLike {
    constructor (payload) {
        this._verifyPayload(payload)
        const { owner, comment } = payload

        this.owner = owner
        this.comment = comment
    }

    _verifyPayload ({ owner, comment }) {
        if (!owner || !comment) {
            throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERY')
        }
        if (typeof owner !== 'string' || typeof comment !== 'string') {
            throw new Error('ADD_LIKE.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddLike
