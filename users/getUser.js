const userHelper = require('../helpers/user')

module.exports.getUser = async (event, context, callback) => {
    var msg = ''
    var user = undefined
    try {
        var input = event.queryStringParameters
        var username = input['username']
        const awsUser = await userHelper.getUser(username)
        user = userHelper.convertToDictUser(awsUser)
        msg = `GET ${event} SUCCESSFULL`
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
            staffs: user,
            input: JSON.stringify(event.queryStringParameters['username']),
        }),
    }

    return response
    // callback(null, response)
}

