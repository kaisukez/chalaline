


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

// function confirmRegis(cognitoUser,code) {
//     cognitoUser.confirmRegistration(code, true, function(err, result) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log(result);
//     });
// }

module.exports.confirmUser = async (event, context, callback) => {
    var body = {}
    var user = JSON.parse(event.body)
    // console.log(user)
    const cognitoUser = userHelper.get_cognitoUser(user['Username'])
    const code = user['ConfirmationCode']
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            body['message'] = `SOME ERROR OCCUR ${err}`
            console.log(err);
        }
        else {
            msg = `CONFIRM ${user['Username']} SUCCESSFULL`
            body = result;
        }
    });
    console.log(body)
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(body),
    }
    return response
}

