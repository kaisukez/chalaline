const AWS = require('aws-sdk')
const userHelper = require('../helpers/user')

AWS.config.update({
    region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const poolID = require('../pool-id.json')
const uuid = require('uuid/v4')

async function signUp(user) {
  if (Object.keys(user).indexOf('custom:custom:StoreID') === -1) {
    user['custom:custom:StoreID'] = uuid()
  }
  if (Object.keys(user).indexOf('custom:custom:branchID') === -1) {
    user['custom:custom:branchID'] = uuid()
  }
  try {
    password = user['password']
    delete user['password']
  } catch (e) {
    console.log(e)
  }
  const awsUser = userHelper.convertToAwsUser(user)
  var params = {
    ClientId: poolID['appClientId'], /* required */
    Password: password, /* required */
    Username: user['email'].split('@')[0], /* required */
    UserAttributes:awsUser,
    ValidationData: userHelper.convertToAwsUser({
      'email': user['email']
    })
  };
  cognito.signUp(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });  
  return params
}

module.exports.registerAsAdmin = async (event, context, callback) => {
  var msg = undefined
  var user = JSON.parse(event.body)
  user['custom:custom:role'] = 'owner'
  try {
    var params = await signUp(user)
    msg = `SIGN UP ${user['email']} SUCCESSFULL`
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
      params: params,
    }),
  }
  return response
}

signUp({
  "email": "test-signin5@hotmail.com",
  "password": "1q2w3e4r",
  "custom:custom:StoreID" : "1"

})