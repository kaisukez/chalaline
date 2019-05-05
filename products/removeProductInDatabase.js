const { _delete } = require('../helpers/dynamodb')

module.exports.removeProductInDatabase = async (event, context, callback) => {
  const TableName = process.env.PRODUCT_TABLE

  const { productID } = JSON.parse(event.body)

  const params = {
    TableName,
    Key: {
      productID
    }
  }

  let message
  const errorMessage = []

  try {
    const result = await _delete(params)
  } catch (error) {
    errorMessage.push(error.message)
  }

  if (errorMessage.length === 0)
    message = `productID[${productID}] was removed from product table`
  else
    message = 'some error occur'

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