class AddComment {
    constructor (payload) {
        this._verifyPayload(payload)

        const { content, owner, thread } = payload

        this.content = content
        this.owner = owner
        this.thread = thread
    }

    _verifyPayload ({ content, owner, thread }) {
        if (!content || !owner || !thread) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERY')
        }

        if (typeof content !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
            throw new Error('ADD_COMMENT.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddComment
