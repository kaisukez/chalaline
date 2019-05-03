const { query } = require('../helpers/index')

module.exports.listProductsInStock = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName, branchName } = JSON.parse(event.body)

  const params = {
    TableName,
    KeyConditionExpression: '#storeName = :storeName and #branchName = :branchName',
    ExpressionAttributeNames: {
      '#storeName': 'storeName',
      '#branchName': 'branchName'
    },
    ExpressionAttributeValues: {
      ':storeName': storeName,
      ':branchName': branchName
    },
    ProjectionExpression: 'stocks'
  }

  const result = await query(params)

  const stocks = result.Items[0].stocks
  console.log(stocks)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      stocks
    }),
  }

  return response
  // callback(null, response)
}