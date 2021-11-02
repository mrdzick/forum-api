const AddedThread = require('../AddedThread')

describe('AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'ini title',
            owner: 'ini owner'
        }

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data types specification', () => {
        const payload = {
            id: 123,
            title: true,
            owner: 'anjay'
        }

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create addedThread object correctly', () => {
        const payload = {
            id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
            title: 'sebuah thread',
            owner: 'user-DWrT3pXe1hccYkV1eIAxS'
        }

        const { id, title, owner } = new AddedThread(payload)

        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(owner).toEqual(payload.owner)
    })
})
