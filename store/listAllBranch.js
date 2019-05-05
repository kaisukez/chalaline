const { query } = require('../helpers/dynamodb')

module.exports.listAllBranch = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName } = JSON.parse(event.body)

  const params = {
    TableName,
    KeyConditionExpression: '#storeName = :storeName',
    ExpressionAttributeNames: {
      '#storeName': 'storeName' 
    },
    ExpressionAttributeValues: {
      ':storeName': storeName
    }
  }

  const result = await query(params)

  const branches = result.Items
  
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