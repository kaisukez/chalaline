const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
})

const createTable = params => {
  return new Promise((resolve, reject) => {
    dynamodb.createTable(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const put = params => {
  return new Promise((resolve, reject) => {
    dynamodb.put(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const get = params => {
  return new Promise((resolve, reject) => {
    dynamodb.get(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const query = params => {
  return new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const scan = params => {
  return new Promise((resolve, reject) => {
    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const update = params => {
  return new Promise((resolve, reject) => {
    dynamodb.update(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const _delete = params => {
  return new Promise((resolve, reject) => {
    dynamodb.delete(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  createTable,
  put,
  get,
  query,
  scan,
  update,
  _delete
}