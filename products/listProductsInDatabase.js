const { query, scan } = require('../helpers/dynamodb')

module.exports.listProductsInDatabase = async (event, context, callback) => {
  const TableName = process.env.PRODUCT_TABLE

  const { queryStringParameters } = event

  let product, products
  if (queryStringParameters && queryStringParameters.productID) {
    const { productID } = queryStringParameters
    const params = {
      TableName,
      KeyConditionExpression: '#productID = :productID',
      ExpressionAttributeNames: {
        '#productID': 'productID'
      },
      ExpressionAttributeValues: {
        ':productID': productID
      }
    }
    const result = await query(params)
    products = result.Items
  } else {
    const params = {
      TableName
    }
    const result = await scan(params)
    products = result.Items
  }



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