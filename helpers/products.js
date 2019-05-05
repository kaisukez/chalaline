const { query, scan } = require('./dynamodb')

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

const getProductDictionary = async () => {
  const TableName = process.env.PRODUCT_TABLE

  const params = {
    TableName
  }

  const result = await scan(params)

  const items = result.Items

  const dictionary = {}
  items.forEach(item => {
    dictionary[item.productID] = {
      ...item
    }
    delete dictionary[item.productID].productID
  })

  return dictionary
}

module.exports = {
  findIndexOfProductInStock,
  getProductDictionary
}