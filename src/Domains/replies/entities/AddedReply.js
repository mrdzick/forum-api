class AddedReply {
    constructor (payload) {
        this._verifyPayload(payload)
        const { id, content, owner } = payload

        this.id = id
        this.content = content
        this.owner = owner
    }

    _verifyPayload ({ id, content, owner }) {
        if (!id || !content || !owner) {
            throw new Error('ADDED_REPLY.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
            throw new Error('ADDED_REPLY.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddedReply
