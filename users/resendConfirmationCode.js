


const AWS = require('aws-sdk')
global.fetch = require("node-fetch");
AWS.config.update({
    region: "ap-southeast-1",
});
AWS.config.apiVersions = {
    cognitoidentity: '2014-06-30',
    // other service API versions
};
const userHelper = require('../helpers/user')

module.exports.resendConfirmationCode = async (event, context, callback) => {
    var msg = 'sucess'
    var user = JSON.parse(event.body)
    console.log(user)
    var cognitoUser = userHelper.get_cognitoUser(user['Username']);
    // console.log(cognitoUser)
    await cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            console.log(err);
            const msg = `SOME ERROR OCCUR ${err}`
        } 
        // else {
        //     // const msg = 'Success'
        //     // console.log(msg);
        // }
    });
    console.log(msg)
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            'message': msg
        }),
    }
    return response
}