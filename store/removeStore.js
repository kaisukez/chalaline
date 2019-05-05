const { _delete, query } = require('../helpers/dynamodb')

const listAllBranch = async storeName => {
  const TableName = process.env.STORE_TABLE

  const params = {
    TableName,
    KeyConditionExpression: '#storeName = :storeName',
    ExpressionAttributeNames: {
      '#storeName': 'storeName' 
    },
    ExpressionAttributeValues: {
      ':storeName': storeName
    },
    ProjectionExpression: 'branchName'
  }

  const result = await query(params)

  const branches = result.Items.map(branch => branch.branchName)

  return branches
}

module.exports.removeStore = async (event, context, callback) => {
  const TableName = process.env.STORE_TABLE

  const { storeName } = JSON.parse(event.body)

  const branches = await listAllBranch(storeName)
  console.log(branches)
  
  let message
  const errorMessage = []

  branches.forEach(async branchName => {
    const params = {
      TableName,
      Key: {
        storeName,
        branchName
      }
    }

    try {
      const result = await _delete(params)
    } catch (error) {
      errorMessage.push(error.message)
    }
  })

  if (errorMessage.length === 0)
    message = `${storeName} was removed`
  else
    message = 'some error occur'

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message,
      errorMessage
    }),
  }

  return response
  // callback(null, response)
}