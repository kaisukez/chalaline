const AWS = require('aws-sdk')
AWS.config.update({
    region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
})
const poolID = require('../pool-id.json')

async function addUser() {
  var params = {
      UserPoolId: poolID["UserPoolId"], /* required */
      Username: 'testStaff', /* required */
      TemporaryPassword: '1q2w3e4r',
      UserAttributes: [
          {
              Name:'email',
              Value: 'test-staff@gmail.com'
          },
          {
              Name:'custom:custom:StoreID',
              Value: "e7375563-bf7f-4923-951f-6502cc94f7e2"
          },
          {
              Name:'custom:custom:branchID',
              Value: "aaaaab"
          },
          {
              Name:'custom:custom:role',
              Value: "staff"
          },
      ],
      ValidationData: [{
              Name: 'email',
              Value: 'test-staff@gmail.com'
          },
      ]
  };
  cognito.adminCreateUser(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });      
}

module.exports.addStaff = async (event, context, callback) => {
  // const { email, StoreID,branchID,role, ...optional } = JSON.parse(event.body)

  // console.log(event.body)
  // UserAttributes
  // const params = {
  //   TableName,
  //   Item: {
  //     productID,
  //     productName,
  //     ...optional
  //   }
  // }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'add staff is not finished, feel free to write some code',
      input: event,
    }),
  }

  return response
  // callback(null, response)
}