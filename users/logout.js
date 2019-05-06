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
// AmazonCognitoIdentity.AuthenticationDetails

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

async function logoutHelper(cognitoUser) {
    if (cognitoUser != null) {
        cognitoUser.signOut();
        console.log('success')
    }
}


module.exports.logout = async (event, context, callback) => {
    var msg = undefined
    var user = JSON.parse(event.body)
    console.log(user)
    try {
        var cognitoUser = userHelper.get_cognitoUser(user['username']);
        await logoutHelper(cognitoUser);
        // var params = await addUser(user)
        msg = `LOGOUT ${user['username']} SUCCESSFULL`
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
        }),
    }
    return response
}