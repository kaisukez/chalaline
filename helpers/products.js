const { query } = require('./dynamodb')

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
  if (result.Count === 0) {
    return {
      index: -1,
      product: undefined
    }
  }

  const stocks = result.Items[0].stocks

  const index = stocks.map(stock => stock.productID).indexOf(productID)
  const product = stocks[index]

  return {
    index,
    product
  }
}

module.exports = {
  findIndexOfProductInStock
}