const AddLike = require('../AddLike')

describe('AddLike entities', () => {
    it('should to throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {}

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERY')
    })

    it('should to throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            owner: true,
            comment: 123
        }

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create AddLike object correctly', () => {
        const payload = {
            owner: 'user-123',
            comment: 'comment-123'
        }

        const { owner, comment } = new AddLike(payload)

        expect(owner).toEqual(payload.owner)
        expect(comment).toEqual(payload.comment)
    })
})
