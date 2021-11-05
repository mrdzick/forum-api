const AddComment = require('../addComment')

describe('an addComment entities', () => {
    it('should to throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {}

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERY')
    })

    it('should to throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            content: true
        }

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create addComment object correctly', () => {
        const payload = {
            content: 'ini isi komentar'
        }

        const { content } = new AddComment(payload)

        expect(content).toEqual(payload.content)
    })
})
