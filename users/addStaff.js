const AWS = require('aws-sdk')
AWS.config.update({
  region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})
const poolID = require('../pool-id.json')
const userHelper = require('../helpers/user')

async function addUser(user) {
  var username = user['email'].split('@')[0]
  var temporaryPassword ='1q2w3e4r'
  if (Object.keys(user).indexOf('username') !== -1) {
    username = user['username']
    delete user['username']
  }
  if (Object.keys(user).indexOf('custom:custom:role') === -1)
    user['custom:custom:role'] = 'staff'
  if (Object.keys(user).indexOf('temporaryPassword') === -1)
      temporaryPassword = user['temporaryPassword']
      delete user['temporaryPassword']

const awsUser = userHelper.convertToAwsUser(user)
  var params = {
    UserPoolId: poolID["UserPoolId"],
    Username: username,
    TemporaryPassword: temporaryPassword,
    UserAttributes:awsUser,
    ValidationData: userHelper.convertToAwsUser({
      'email': user['email']
    })
  };
  await cognito.adminCreateUser(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      return data
    }
  });
  return params
}

module.exports.addStaff = async (event, context, callback) => {
  var msg = undefined
  var user = JSON.parse(event.body)
  try {
    var params = await addUser(user)
    msg = `ADD  ${params['Username']} SUCCESSFULL`
  } catch (err){
    msg = `SOME ERROR OCCUR ${err}`
  }
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: msg,
      user:params
    }),
  }
  return response
}