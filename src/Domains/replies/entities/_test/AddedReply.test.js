const AddedReply = require('../AddedReply')

describe('AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'reply-123',
            content: 'ini isi komentar'
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data types specification', () => {
        const payload = {
            id: 123,
            content: true,
            owner: 'user-123'
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create AddedReply object correctly', () => {
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan komentar',
            owner: 'user-123'
        }

        const { id, content, owner } = new AddedReply(payload)

        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
    })
})
