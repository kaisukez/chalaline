const AWS = require('aws-sdk')
    AWS.config.update({
        region: "ap-southeast-1",
    });
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const poolID = require('./pool-id.json')

async function getUser (username) {
    try {
        const user = await cognito.adminGetUser({
            UserPoolId: poolID["UserPoolId"],
            Username: username
            // UserPoolId: process.env.COGNITO_USER_POOL_ID,
            // Username: userId,
        }).promise()
        console.log(user.UserAttributes)
        return user.UserAttributes
    } catch (err) {
        console.log(err)
    }
}

var res = getUser('am')
console.log(res)