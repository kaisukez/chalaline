const { scan } = require('../helpers/dynamodb')

module.exports.listAllStore = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const params = {
    TableName
  }

  const result = await scan(params)

  const stores = result.Items.map(store => ({
    storeName: store.storeName,
    branchName: store.branchName
  }))
  // console.log(stores)

  const branches = {}
  stores.forEach(store => {
    if (!branches[store.storeName])
      branches[store.storeName] = [store.branchName]
    else
      branches[store.storeName].push(store.branchName)
  })
  // console.log(branches)

  const newStores = Object.keys(branches).map(storeName => ({
    storeName,
    branches: branches[storeName]
  }))
  // const uniqueStores = [...new Set(stores)].sort()
  
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      stores: newStores
    }),
  }

  return response
  // callback(null, response)
}