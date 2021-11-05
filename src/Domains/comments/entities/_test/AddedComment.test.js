const AddedComment = require('../addedComment')

describe('AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'comment-123',
            content: 'ini isi komentar'
        }

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data types specification', () => {
        const payload = {
            id: 123,
            content: true,
            owner: 'user-123'
        }

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create addedThread object correctly', () => {
        const payload = {
            id: 'comment-123',
            content: 'sebuah komentar',
            owner: 'user-123'
        }

        const { id, content, owner } = new AddedComment(payload)

        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
    })
})
