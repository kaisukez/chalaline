const AWS = require('aws-sdk')
AWS.config.update({
    region: "ap-southeast-1",
});
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolID = require('../pool-id.json')

async function getUser (username) {
    try {
        const user = await cognito.adminGetUser({
            UserPoolId: poolID["UserPoolId"],
            Username: username
        }).promise()
        // console.log(user.UserAttributes)
        return user.UserAttributes
    } catch (err) {
        console.log(err)
    }
}

function filterRoles(users, roles = ['staff']) {
    let staffs = []
    for (var i=0; i<users.length; i++) {
        user = users[i]
        if (roles.indexOf(user['custom:custom:role']) !== -1) {
            staffs.push(user)
        }
    }
    return staffs
}

function convertToAwsUser(user) {
    var awsUser = []
    for (attribute in user) {
        awsUser.push({
            'Name': attribute,
            'Value': user[attribute]
        })
    }
    return awsUser
}

function convertToDictUser(awsUser) {
    var user = {}
    // for (var i=0; i<awsUser.length; i++) {
    //     var key = awsUser[i]['Name']
    //     var value = awsUser[i]['Value']
    //     user[key]=value
    // }
    awsUser.forEach(attr => {
        var key = attr['Name']
        var value = attr['Value']
        user[key]=value

    });
    return user
}

function get_cognitoUser(username) {
    var poolData = { UserPoolId : poolID["UserPoolId"],
        ClientId : poolID["appClientId"]
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        // Username : authenticationData['Username'],
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return cognitoUser
}


module.exports = { 
    getUser,
    filterRoles,
    convertToAwsUser,
    convertToDictUser,
    get_cognitoUser
};
