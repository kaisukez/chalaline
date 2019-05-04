const { scan } = require('../helpers/index')

module.exports.showStoreDatabase = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const params = {
    TableName
  }

  const result = await scan(params)

  const storeDatabase = result.Items

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      storeDatabase
    }),
  }

  return response
  // callback(null, response)
}