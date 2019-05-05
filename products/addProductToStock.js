const { query, update, put } = require('../helpers/dynamodb')

const doesProductIDAlreadyExists = async (storeName, branchName, productID) => {
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
    },
    ProjectionExpression: 'stocks'
  }

  const result = await query(params)

  const stocks = result.Items[0].stocks

  let found = false
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].productID === productID) {
      found = true
      break
    }
  }

  return found
}

const doesProductIDExistsInProductDatabase = async productID => {
  const TableName = process.env.PRODUCT_TABLE

  const params = {
    TableName,
    KeyConditionExpression: '#productID = :productID',
    ExpressionAttributeNames: {
      '#productID': 'productID'
    },
    ExpressionAttributeValues: {
      ':productID': productID
    },
    ProjectionExpression: 'productID'
  }

  const result = await query(params)
  
  return result.Count > 0
}

const addProductToProductDatabase = async (productID, productDetail) => {
  const TableName = process.env.PRODUCT_TABLE

  const params = {
    TableName,
    Item: {
      productID,
      ...productDetail
    }
  }

  let success

  try {
    const result = await put(params)
    success = true
  } catch (error) {
    success = false
  }

  return success
}

module.exports.addProductToStock = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const {
    storeName,
    branchName,
    productID,
    ...optional
  } = JSON.parse(event.body)

  const productDetail = optional.productDetail
  delete optional.productDetail

  let found

  found = await doesProductIDExistsInProductDatabase(productID)
  if (!found) {
    await addProductToProductDatabase(productID, productDetail)
  }

  found = await doesProductIDAlreadyExists(storeName, branchName, productID)
  if(found) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `productID[${productID}] already exists`
      }),
    }
  }

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
    message = `productID[${productID}] was added to stock.`
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