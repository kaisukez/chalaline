const { update } = require('../helpers/dynamodb')
const { findIndexOfProductInStock } = require('../helpers/products')

mobule.exports.setProductPublicity = (event, context, callback) => {
  const TableName = process.env.STORE_TABLE
}