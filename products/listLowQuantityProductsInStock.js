const { query } = require('../helpers/dynamodb')
const { getProductDictionary } = require('../helpers/products')

module.exports.listLowQuantityProductsInStock = async (event, context, callback) => {
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

  const lowQuantityProducts = stocks.filter(product => product.quantity <= product.notiQuantity)

  const productDictionary = await getProductDictionary()
  const lowQuantityProductsWithMoreAttributes = lowQuantityProducts.map(product => ({
    ...product,
    ...productDictionary[product.productID]
  }))

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      products: lowQuantityProductsWithMoreAttributes
    }),
  }

  return response
  // callback(null, response)
}