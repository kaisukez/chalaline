module.exports.listPublishedProducts = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'list published products is not finished, feel free to write some code',
      // input: event,
    }),
  }

  return response
  // callback(null, response)
}