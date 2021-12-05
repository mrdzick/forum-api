const AddReply = require('../AddReply')

describe('AddReply entities', () => {
    it('should to throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {}

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERY')
    })

    it('should to throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            content: true,
            owner: 123,
            comment: 'comment-123',
            thread: 'thread-123'
        }

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create AddReply object correctly', () => {
        const payload = {
            content: 'ini isi komentar',
            owner: 'user-123',
            comment: 'comment-123',
            thread: 'thread-123'
        }

        const { content, owner, comment, thread } = new AddReply(payload)

        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
        expect(comment).toEqual(payload.comment)
        expect(thread).toEqual(payload.thread)
    })
})
