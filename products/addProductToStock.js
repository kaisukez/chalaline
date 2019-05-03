const { update } = require('../helpers/index')

module.exports.addProductToStock = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const {
    storeName,
    branchName,
    productID,
    ...optional
  } = JSON.parse(event.body)

  const params = {
    TableName,
    Key: {
      storeName,
      branchName
    },
    UpdateExpression: 'set #stocks = list_append(if_not_exists(#stocks, :empty_list), :product)',
    ExpressionAttributeNames: {
      '#stocks': 'stocks'
    },
    ExpressionAttributeValues: {
      ':empty_list': [],
      ':product': [{
        productID,
        ...optional
      }]
    },
    ReturnValues: 'UPDATED_NEW'
  }

  let message

  try {
    const result = await update(params)
    message = `[${productID}] was added to stock.`
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