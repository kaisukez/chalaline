const { _delete } = require('../helpers/index')

module.exports.removeBranch = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName, branchName } = JSON.parse(event.body)

  const params = {
    TableName,
    Key: {
      storeName,
      branchName
    }
  }

  let message, errorMessage

  try {
    const result = await _delete(params)
    message = `${branchName} branch was removed.`
  } catch (error) {
    message = `some error occur`
    errorMessage = error.message
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message,
      errorMessage
    }),
  }

  return response
  // callback(null, response)
}