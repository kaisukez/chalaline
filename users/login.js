const AWS = require('aws-sdk')
global.fetch = require("node-fetch");
AWS.config.update({
    region: "ap-southeast-1",
});
AWS.config.apiVersions = {
    cognitoidentity: '2014-06-30',
    // other service API versions
};


const poolID = require('../pool-id.json')
const userHelper = require('../helpers/user')

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

async function authenticateUser(authenticationData) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var cognitoUser = userHelper.get_cognitoUser(authenticationData['Username']);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            var idToken = result.idToken.jwtToken;
            console.log('success')
            return {
                'accessToken': accessToken,
                'idToken':idToken,
                'message': `LOGIN ${authenticationData['Username']} SUCCESSFULL`
            }
        },
        onFailure: function(err) {
            console.log(err)
            return {'message':`SOME ERROR OCCUR ${err}`}
            // console.log('ERROR')
            // alert(err);
        },

    });
}


module.exports.login = async (event, context, callback) => {
    var msg = undefined
    var user = JSON.parse(event.body)
    var body = {}
    try {
        var token = await authenticateUser(user)
        body['message'] = `ADD  ${user['Username']} SUCCESSFULL`
        // body = token
    } catch (err) {
        body['message'] = `SOME ERROR OCCUR ${err}`
        console.log(err)
        // msg = `SOME ERROR OCCUR ${err}`
    }
    console.log('body',body)
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(body),
    }
    return response
}

// authenticateUser(   {
//     Username : 'charaline.cloud',
//     Password : '1q2w3e4r',
// })