const { scan } = require('../helpers/dynamodb')
const { getProductDictionary } = require('../helpers/products')

const filterOnlyPublicProduct = stores => {
  const newStores = stores
    .map(store => {
      store.stocks = store.stocks.filter(product => product.isPublic === true)
      return store
    })
    .filter(store => store.stocks.length !== 0)
    .map(store => {
      let stock = store.stocks.map(stock =>{
        stock.storeID = store.storeID
        stock.storeName = store.storeName
        stock.branchName = store.branchName
        return stock
      })
      return stock
    })
    .reduce(function(pre, []) {
      return pre.concat(cur);
    })
  // console.log("fff",newStores)
  return newStores
}

// const changeDataStructure = filtered => {
//   return filtered.map(store => {
//     store.stocks = store.stocks.map(product => ({
//       ...product,
//       storeID: store.storeID,
//       storeName: store.storeName,
//       branchName: store.branchName
//     }))
//     return store.stocks
//   })
// }

module.exports.listPublicProducts = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName } = JSON.parse(event.body)
  // const storeName = ""
  const params = {
    TableName,
    FilterExpression: '#storeName <> :storeName',
    ExpressionAttributeNames: {
      '#storeName': 'storeName',
    },
    ExpressionAttributeValues: {
      ':storeName': storeName,
    },
    ProjectionExpression: 'storeID, storeName, branchName, stocks'
  }

  const result = await scan(params)
  console.log(result)

  const stores = result.Items
  const filtered = filterOnlyPublicProduct(stores)

  const productDictionary = await getProductDictionary()

  const publicProducts = filtered.map(product => ({
    ...product,
    ...productDictionary[product.productID]
  }))

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      publicProducts
    }),
  }

  return response
  // callback(null, response)
}