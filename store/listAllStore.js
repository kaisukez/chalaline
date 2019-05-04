const { scan } = require('../helpers/index')

module.exports.listAllStore = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const params = {
    TableName
  }

  const result = await scan(params)

  const stores = result.Items.map(store => store.storeName)

  const uniqueStores = [...new Set(stores)].sort()
  
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      stores: uniqueStores
    }),
  }

  return response
  // callback(null, response)
}