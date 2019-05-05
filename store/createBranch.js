const { put } = require('../helpers/index')

module.exports.createBranch = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName, branchName, ...optional } = JSON.parse(event.body)

  const params = {
    TableName,
    Item: {
      storeName,
      branchName,
      stocks: [],
      history: [],
      ...optional
    }
  }

  let message

  try {
    const result = await put(params)
    message = `${branchName} branch was created.`
  } catch {
    message = `some error occur`
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message
    }),
  }

  return response
  // callback(null, response)
}