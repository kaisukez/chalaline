var AWS = require("aws-sdk");
var table = require('./store.json')
AWS.config.update({
  
  region: "ap-southeast-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

var tableName = 'Store';

function addNewItem(params) {
    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    })
}

(table).forEach(record => {
    var params = {
        TableName:tableName,
        Item:record
    }
    addNewItem(params)
    console.log(params)
});