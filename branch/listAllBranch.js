const { query } = require('../helpers/index')

module.exports.listAllBranch = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeID } = JSON.parse(event.body)

  const params = {
    TableName,
    KeyConditionExpression: '#storeID = :storeID',
    ExpressionAttributeNames: {
      '#storeID': 'storeID' 
    },
    ExpressionAttributeValues: {
      ':storeID': storeID
    },
    ProjectionExpression: 'branchName'
  }

  const result = await query(params)

  const branches = result.Items.map(branch => branch.branchName)
  
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      branches
    }),
  }

  return response
  // callback(null, response)
}