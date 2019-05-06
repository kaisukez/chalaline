const AWS = require('aws-sdk')
AWS.config.update({
    region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolID = require('../pool-id.json')


var data = { 
    UserPoolId : poolID["UserPoolId"],
    ClientId : poolID["appClientId"]
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
var cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
        if (err) {
        //    alert(err);
        //     return;
            console.log(err)
        }
        else {
            console.log('session validity: ' + session.isValid());
            var key = `cognito-idp.${poolID['region']}.amazonaws.com/${poolID['UserPoolId']}`
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : poolID['IdentityPoolId'] ,// your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    key : session.getIdToken().getJwtToken()
                }
            });
    
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
        }

    });
}
