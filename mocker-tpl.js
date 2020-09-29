/**
 * webpack-mocker-api
 * https://www.npmjs.com/package/webpack-mocker-api
 */
const { wrapper } = require('webpack-mocker-api')

const mockerApis = {
  'GET /_api/v1/example': {
    data: {
      auth: ['123']
    }
  }
}

module.exports = wrapper(mockerApis)
