const AWS = require('aws-sdk')
AWS.config.update({
    region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const poolID = require('../pool-id.json')
const userHelper = require('../helpers/user')

async function getUsers (filter=undefined,filterAttributes=undefined) {
    // filter example --> "atributeName = \"attributeValue\""
    params = {
        "Filter": filter,
        "UserPoolId": poolID["UserPoolId"],
        'AttributesToGet': filterAttributes
    }
    try {
        const rawUsers = await cognito.listUsers(params).promise()
        var users = []
        rawUsers['Users'].forEach(rawUser => {
            var attributes = rawUser.Attributes
            var user = userHelper.convertToDictUser(attributes)
            users.push(user)
        });
        return users
    } catch (err) {
        console.log(err)
    }
}

module.exports.listStaffs = async (event, context, callback) => {
  var msg = ''
  try {
    const raw_users = await getUsers()
    var users = await userHelper.filterRoles(raw_users)
    msg = 'LIST STAFFS SUCCESSFULL'
  } catch (err) {
    msg = `SOME ERROR OCCUR ${err}`
  }
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: msg,
      staffs:users
      // input: event,
    }),
  }

  return response
  // callback(null, response)
}