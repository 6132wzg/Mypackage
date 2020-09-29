/**
 * webpack-mocker-api
 * https://www.npmjs.com/package/webpack-mocker-api
 */
const { wrapper } = require('webpack-mocker-api')

const mockerApis = {
  'GET /_api/v1/member/member_card/609802225517606': {
    data: {
      auth: ['123']
    }
  }
}

module.exports = wrapper(mockerApis)
