const GetThread = require('../GetThread')

describe('GetThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'ini id',
            title: 'ini title',
            body: 'ini body',
            date: 'ini date'
        }

        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.PAYLOAD_DID_NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data types specification', () => {
        const payload = {
            id: 'ini id',
            title: 'ini title',
            body: 'ini body',
            date: true,
            username: 123
        }

        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should create GetThread object correctly', () => {
        const payload = {
            id: 'ini id',
            title: 'ini title',
            body: 'ini body',
            date: '20-11-2021',
            username: 'user-123'
        }

        const { id, title, body, date, username } = new GetThread(payload)

        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(date).toEqual(payload.date)
        expect(username).toEqual(payload.username)
    })
})
