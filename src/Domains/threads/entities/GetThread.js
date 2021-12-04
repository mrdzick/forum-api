class GetThread {
    constructor (payload) {
        this._verifyPayload(payload)
        const { id, title, body, date, username } = payload

        this.id = id
        this.title = title
        this.body = body
        this.date = date.toString()
        this.username = username
    }

    _verifyPayload ({ id, title, body, date, username }) {
        if (!id || !title || !body || !date || !username) {
            throw new Error('GET_THREAD.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string') {
            throw new Error('GET_THREAD.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
        }
    }
}

module.exports = GetThread
