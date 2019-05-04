const AWS = require('aws-sdk')
    AWS.config.update({
        region: "ap-southeast-1",
    });
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const poolID = require('../pool-id.json')

async function getUser (username) {
    try {
        const user = await cognito.adminGetUser({
            UserPoolId: poolID["UserPoolId"],
            Username: username
        }).promise()
        console.log(user.UserAttributes)
        return user.UserAttributes
    } catch (err) {
        console.log(err)
    }
}

async function filterRoles(users, roles = ['staff']) {
    let staffs = []
    users.forEach(user => {
        if (roles.indexOf(user['custom:custom:role']) !== -1) {
            staffs.push(user)
        }
    });
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

function convertToDictUser(attributes) {
    var user = {}
    attributes.forEach(attribute => {
        var key = attribute['Name']
        var value = attribute['Value']
        user[key]=value
    });
    return user
}

module.exports = { 
    getUser,
    filterRoles,
    convertToAwsUser,
    convertToDictUser
};
