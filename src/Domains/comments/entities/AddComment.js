class AddComment {
    constructor (payload) {
        this._verifyPayload(payload)

        this.content = payload.content
    }

    _verifyPayload ({ content }) {
        if (!content) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERY')
        }

        if (typeof content !== 'string') {
            throw new Error('ADD_COMMENT.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddComment
