class AddedThread {
    constructor (payload) {
        this._verifyPayload(payload)
        const { id, title, owner } = payload

        this.id = id
        this.title = title
        this.owner = owner
    }

    _verifyPayload ({ id, title, owner }) {
        if (!id || !title || !owner) {
            throw new Error('ADDED_THREAD.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
            throw new Error('ADDED_THREAD.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = AddedThread
