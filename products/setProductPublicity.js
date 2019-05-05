const { update } = require('../helpers/dynamodb')
const { findIndexOfProductInStock } = require('../helpers/products')

module.exports.setProductPublicity = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const {
    storeName,
    branchName,
    productID,
    isPublic
  } = JSON.parse(event.body)

  const indexToUpdate = await findIndexOfProductInStock(storeName, branchName, productID)
  if (indexToUpdate === -1) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `productID[${productID}] doesn't exist in stock`
      }),
    }
  }

  const params = {
    TableName,
    Key: {
      storeName,
      branchName
    },
    UpdateExpression: `set stocks[${indexToUpdate}].isPublic = :isPublic`,
    ExpressionAttributeValues: {
      ':isPublic': isPublic
    },
    ReturnValues: 'UPDATED_NEW'
  }

  let message
  const errorMessage = []

  try {
    const result = await update(params)
  } catch (error) {
    errorMessage.push(error.message)
  }

  if (errorMessage.length === 0)
    message = `productID[${productID}] publicity was updated to ${isPublic}`
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
}