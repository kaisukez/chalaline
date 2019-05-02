module.exports.removeBranch = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'remove branch is not finish, feel free to write some code',
      // input: event,
    }),
  };
  callback(null, response)
}