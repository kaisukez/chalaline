const { query } = require('../helpers/dynamodb')
const { getProductDictionary } = require('../helpers/products')

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

  const productDictionary = await getProductDictionary()

  const stocks = result.Items[0].stocks.map(product => ({
    ...product,
    ...productDictionary[product.productID]
  }))

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