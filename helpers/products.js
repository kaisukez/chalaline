const { query } = require('./index')

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

module.exports = {
  findIndexOfProductInStock
}