const { update, query } = require('../helpers/index')

const findIndexOfProductInStock = async (storeName, branchName, productID) => {
  const TableName = process.env.STORE_TABLE

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
    }
  }

  const result = await query(params)

  const stocks = result.Items[0].stocks

  const index = stocks.map(stock => stock.productID).indexOf(productID)

  return index
}

module.exports.removeProductInStock = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName, branchName, productID } = JSON.parse(event.body)

  const indexToDelete = await findIndexOfProductInStock(storeName, branchName, productID)
  if (indexToDelete === -1) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `productID[${productID}] is not exists in stock`
      }),
    }
  }

  const params = {
    TableName,
    Key: {
      storeName,
      branchName
    },
    UpdateExpression: `remove stocks[${indexToDelete}]`,
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
    message = `productID[${productID}] was removed from stock`
  else
    message = 'some error occur'

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message,
      errorMessage,
    }),
  }

  return response
  // callback(null, response)
}