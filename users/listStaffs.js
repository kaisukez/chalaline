const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})

module.exports.listStaffs = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'list staffs is not finished, feel free to write some code',
      username:username
      // input: event,
    }),
  }

  return response
  // callback(null, response)
}