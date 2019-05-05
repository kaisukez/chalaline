const { scan } = require('../helpers/dynamodb')

const filterOnlyPublicProduct = stores => {
  const newStores = stores
    .map(store => {
      store.stocks = store.stocks.filter(product => product.isPublic === true)
      return store
    })
    .filter(store => store.stocks.length !== 0)
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

  // const { storeName } = JSON.parse(event.body)
  // const storeName = ""
  const params = {
    TableName,
    // FilterExpression: '#storeName <> :storeName',
    // ExpressionAttributeNames: {
    //   '#storeName': 'storeName',
    // },
    // ExpressionAttributeValues: {
    //   ':storeName': storeName,
    // },
    ProjectionExpression: 'storeID, storeName, branchName, stocks'
  }

  const result = await scan(params)

  const stores = result.Items
  const filtered = filterOnlyPublicProduct(stores)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      publicProducts: filtered
    }),
  }

  return response
  // callback(null, response)
}