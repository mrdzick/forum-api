class AddReply {
    constructor (payload) {
        this._verifyPayload(payload)
        const { content, owner, comment, thread } = payload

        this.content = content
        this.owner = owner
        this.comment = comment
        this.thread = thread
    }

    _verifyPayload ({ content, owner, comment }) {
        if (!content || !owner || !comment) {
            throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERY')
        }

        if (typeof content !== 'string' || typeof owner !== 'string' || typeof comment !== 'string') {
            throw new Error('ADD_REPLY.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddReply
