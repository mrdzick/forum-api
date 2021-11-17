/* istanbul ignore file */
const Jwt = require('@hapi/jwt')

const ServerTestHelper = {
    getAccessToken: async () => {
        const payloadUser = {
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia'
        }
        return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY)
    }
}

module.exports = ServerTestHelper
