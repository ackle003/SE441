'use strict';
var AWS = require("aws-sdk");
var table = "users";
var outputString = "";
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
function writeToTable(intentRequest,callback,count)
{
    var slots = intentRequest.currentIntent.slots;
    var username = slots.username;
    var role = slots.role;
    var name = slots.personName.split(" ");
    
    
    var params = {
        TableName: table,
        Item:{
            "username": username,
            "role": role,
            "last_name": name[1]
            
            }
        };
    docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        outputString = "Error, unsuccessful";
        callback(null, close());
        } 
    else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        outputString = "Successfully registered: " + role + "  user: " + username;
       // responseManager(intentRequest, callback);
       callback(null, close());
        }
    });
    return new Promise((resolve, reject) => {
        });
    
}//end write to Table

function close(fulfillmentState, message) {
    return {
        
        dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message:{
            content:outputString,
            contentType:'PlainText',
            
            
            }
        },
    };
}

exports.handler = async (intentRequest, context, callback, sessionAttributes) => {
     var written = await writeToTable(intentRequest,callback);
     
};
