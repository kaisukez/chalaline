const AWS = require('aws-sdk')
AWS.config.update({
  region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})
const poolID = require('../pool-id.json')
const userHelper = require('../helpers/user')

async function formatUsers(awsUsers) {
  var users = []
  // console.log(awsUsers)
  for (var i = 0; i < awsUsers.length; i++) {
    var awsUser = awsUsers[i]
    // console.log(awsUser,awsUsers[i])
    var attributes = awsUser.Attributes
    var user = userHelper.convertToDictUser(attributes)
    user['username'] = awsUser.Username
    users.push(user)
  }
}


async function getUsers(filter = undefined, filterAttributes = undefined) {
  // filter example --> "atributeName = \"attributeValue\""
  params = {
    "Filter": filter,
    "UserPoolId": poolID["UserPoolId"],
    'AttributesToGet': filterAttributes
  }
  try {
    const input = await cognito.listUsers(params).promise()
    const awsUsers = input['Users']
    return awsUsers
  } catch (err) {
    console.log(err)
  }
}

module.exports.listStaffs = async (event, context, callback) => {
  var msg = ''
  var users = undefined
  var raw_users = undefined
  try {
    raw_users = await getUsers()
    var all_users = formatUsers(raw_users)
    users = await userHelper.filterRoles(all_users)
    // users = await getUsers()
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
      staffs: users,
      awsUser: raw_users
      // input: event,
    }),
  }

  return response
  // callback(null, response)
}