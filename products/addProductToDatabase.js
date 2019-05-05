const uuidv4 = require('uuid/v4')
const { put } = require('../helpers/dynamodb')

module.exports.addProductToDatabase = async (event, context, callback) => {
  const TableName = process.env.PRODUCT_TABLE

  let { productID, productName, ...optional } = JSON.parse(event.body)

  if (!productID)
    productID = uuidv4()

  const params = {
    TableName,
    Item: {
      productID,
      productName,
      ...optional
    }
  }

  let message

  try {
    const result = await put(params)
    message = `productID[${productID}] ${productName} was added to database.`
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