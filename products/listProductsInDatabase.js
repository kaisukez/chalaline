const { scan } = require('../helpers/index')

module.exports.listProductsInDatabase = async (event, context, callback) => {
  const TableName = process.env.PRODUCT_TABLE

  const params = {
    TableName
  }

  const result = await scan(params)

  const products = result.Items
  console.log(products)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      products
    }),
  }

  return response
  // callback(null, response)
}