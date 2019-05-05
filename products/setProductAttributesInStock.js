const { update } = require('../helpers/dynamodb')
const { findIndexOfProductInStock } = require('../helpers/products')

const generateUpdateExpression = (indexToUpdate, attributes) => {
  let UpdateExpression = 'set '
  Object.keys(attributes).forEach((attributeName, index) => {
    UpdateExpression += `stocks[${indexToUpdate}].${attributeName} = :${attributeName}`
    if (index !== Object.keys(attributes).length - 1)
      UpdateExpression += ', '
  })
  return UpdateExpression
}

const generateExpressionAttributeValues = attributes => {
  const ExpressionAttributeValues = {}
  Object.keys(attributes).forEach(attributeName => {
    ExpressionAttributeValues[`:${attributeName}`] = attributes[attributeName]
  })
  return ExpressionAttributeValues
}

module.exports.setProductAttributesInStock = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const {
    storeName,
    branchName,
    productID,
    ...attributes
  } = JSON.parse(event.body)

  const { index: indexToUpdate } = await findIndexOfProductInStock(storeName, branchName, productID)
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

  const UpdateExpression = generateUpdateExpression(indexToUpdate, attributes)
  const ExpressionAttributeValues = generateExpressionAttributeValues(attributes)

  const params = {
    TableName,
    Key: {
      storeName,
      branchName
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW'
  }

  let message
  const errorMessage = []

  try {
    const result = await update(params)
  } catch (error) {
    console.log(error)
    errorMessage.push(error.message)
  }

  if (errorMessage.length === 0)
    message = `productID[${productID}] attributes are updated`
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