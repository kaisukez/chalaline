module.exports.createBranch = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'create branch is not finished, feel free to write some code',
      // input: event,
    }),
  };
  callback(null, response)
}