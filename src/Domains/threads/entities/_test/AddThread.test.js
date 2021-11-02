const AddThread = require('../AddThread')

describe('an AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'sebuah title thread',
            body: 'sebuah body thread'
        }

        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERY')
    })

    it('should throw error when payload did not meet data type spesification', () => {
        const payload = {
            title: 123,
            body: true,
            owner: 'seorang owner thread'
        }

        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.DATA_TYPES_OF_PAYLOAD_IS_NOT_VALID')
    })

    it('should throw error when title contains more than 50 characters', () => {
        const payload = {
            title: 'p1dmiYR6nU7SkH5AJZ09P5rz29y5nyIPCHjLLFahpQiERYbt99o',
            body: 'sebuah body thread',
            owner: 'seorang owner thread'
        }

        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR')
    })

    it('should create addThread object correctly', () => {
        const payload = {
            title: 'ini title',
            body: 'ini bagian body',
            owner: 'ini bagian owner'
        }

        const { title, body, owner } = new AddThread(payload)

        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(owner).toEqual(payload.owner)
    })
})
