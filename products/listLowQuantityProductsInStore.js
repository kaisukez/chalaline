const { scan } = require('../helpers/dynamodb')

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
  console.log(stocks)

  const lowQuantityProducts = stocks.map(branch => {
    branch.stocks = branch.stocks.filter(product => product.quantity <= product.notiQuantity)
    return branch
  })

  // const lowQuantityProducts = stocks.filter(product => product.quantity <= product.notiQuantity)

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