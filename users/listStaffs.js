const AWS = require('aws-sdk')
AWS.config.update({
  region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})
const poolID = require('../pool-id.json')
const userHelper = require('../helpers/user')

function formatUsers(awsUsers) {
  var users = []
  awsUsers.forEach(awsUser => {
    var attributes = awsUser['Attributes']
    var user = userHelper.convertToDictUser(attributes)
    user['username'] = awsUser['Username']
    users.push(user)
  });
  return users
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
    // console.log(awsUsers)
    return awsUsers
  } catch (err) {
    console.log(err)
    return undefined
  }
}

module.exports.listStaffs = async (event, context, callback) => {
  // var msg = ''
  // var users = undefined
  // var raw_users = undefined
  const raw_users = await getUsers()
  const users = formatUsers(raw_users)
  const staffs = userHelper.filterRoles(users)
  console.log(users)
  // users = await getUsers()
  // msg = 'LIST STAFFS SUCCESSFULL'
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(staffs),
  }

  return response
  // callback(null, response)
}