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

async function changePassword(cognitoUser) {
    var oldPassword = '1q2w3e4r'
    var newPassword = 'charaline#48'
    cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
        if (err) {
            // alert(err);
            // return;
            console.log(err)
        } else {
            console.log('call result: ' + result);
        }
    });
}

changePassword(userHelper.get_cognitoUser('bunditnoikiku'))


