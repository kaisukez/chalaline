


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


// function confirmRegis(cognitoUser) {
//     cognitoUser.resendConfirmationCode(function(err, result) {
//         if (err) {
//             console.log(err);
//             return;
//            }
//            console.log(result);
//     });
// }

module.exports.resendConfirmationCode = async (event, context, callback) => {
    var msg = undefined
    var user = JSON.parse(event.body)
    console.log(user)
    var cognitoUser = userHelper.get_cognitoUser(user['Username']);
    console.log(cognitoUser)
    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            console.log(err);
            msg = `SOME ERROR OCCUR ${err}`
           }
           msg = 'Success'
           console.log(result);
    });
    console.log(msg)
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(msg),
    }
    return response
}
// confirmRegis(userHelper.get_cognitoUser('bunditnoikiku'))