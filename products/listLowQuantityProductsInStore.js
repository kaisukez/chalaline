const { scan } = require('../helpers/dynamodb')
const { getProductDictionary } = require('../helpers/products')

module.exports.listLowQuantityProductsInStore = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName } = JSON.parse(event.body)

  const params = {
    TableName,
    FilterExpression: "#storeName = :storeName",
    ExpressionAttributeNames: {
      '#storeName': 'storeName'
    },
    ExpressionAttributeValues: {
      ':storeName': storeName
    }
  }

  const result = await scan(params)

  const stocks = result.Items

  const productDictionary = await getProductDictionary()
  const lowQuantityProducts = stocks.map(branch => {
    branch.stocks = branch.stocks
      .filter(product => product.quantity <= product.notiQuantity)
      .map(product => ({
        ...product,
        ...productDictionary[product.productID]
      }))
    return branch
  })

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      branches: lowQuantityProducts
      // products: lowQuantityProducts
    }),
  }

  return response
  // callback(null, response)
}