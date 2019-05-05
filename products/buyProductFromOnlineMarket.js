const { update } = require('../helpers/dynamodb')
const { findIndexOfProductInStock } = require('../helpers/products')

const updateProductQuantity = async (storeName, branchName, productID, quantity) => {
  const TableName = process.env.STORE_TABLE

  const { index } = await findIndexOfProductInStock(storeName, branchName, productID)

  if (index !== -1) {
    const params = {
      TableName,
      Key: {
        storeName,
        branchName
      },
      UpdateExpression: `set stocks[${index}].quantity = :quantity`,
      ExpressionAttributeValues: {
        ':quantity': quantity
      },
      ReturnValues: 'UPDATED_NEW'
    }

    const result = await update(params)
  } else {
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
          quantity,
          notiQuantity: Math.round(quantity * 0.2),
          isPublic: false
        }]
      },
      ReturnValues: 'UPDATED_NEW'
    }

    const result = await update(params)
  }
}

module.exports.buyProductFromOnlineMarket = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const {
    storeName,
    branchName,
    buyFromStoreName,
    buyFromBranchName,
    productID,
    quantity
  } = JSON.parse(event.body)

  const {
    index: indexToBuy,
    product: productToBuy
  } = await findIndexOfProductInStock(buyFromStoreName, buyFromBranchName, productID)

  // no branch, no product, private
  if (indexToBuy === -1 || !productToBuy.isPublic) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `productID[${productID}] doesn't exist in storeName[${buyFromStoreName}] branchName[${buyFromBranchName}]`
      }),
    }
  }

  // check if enough quantity to buy
  if (productToBuy.quantity < quantity) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: `productID[${productID}] is not enough to buy`,
        quantityNow: productToBuy.quantity,
        quantityToBuy: quantity
      }),
    }
  }

  try {
    const { product: productInStock } = await findIndexOfProductInStock(storeName, branchName, productID)
    let quantityInStock = 0
    if (productInStock) {
      quantityInStock = productInStock.quantity
    }
    await updateProductQuantity(buyFromStoreName, buyFromBranchName, productID, productToBuy.quantity - quantity)
    await updateProductQuantity(storeName, branchName, productID, quantityInStock + quantity)
  } catch (error) {
    // console.log(error)
  }
  
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: `buy ${quantity} productID[${productID}] from storeName[${storeName}] branchName[${branchName}] successfully`
    }),
  }

  return response
}