const AWS = require('aws-sdk')
    AWS.config.update({
        region: "ap-southeast-1",
    });
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
const poolID = require('./pool-id.json')

async function getUsers (filter=undefined,filterAttributes=undefined) {
    // filter example --> "atributeName = \"attributeValue\""
    params = {
        "Filter": filter,
        "UserPoolId": poolID["UserPoolId"],
        'AttributesToGet': filterAttributes
    }
    try {
        const rawUsers = await cognito.listUsers(params).promise()
        var users = []
        rawUsers['Users'].forEach(rawUser => {
            var attributes = rawUser.Attributes
            var user = {}
            attributes.forEach(attribute => {
                var key = attribute['Name']
                var value = attribute['Value']
                user[key]=value
            });
            users.push(user)
        });
        console.log(users)
        return users
    } catch (err) {
        console.log(err)
    }
}

var res = getUsers()
// console.log(res)