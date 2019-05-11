'use strict';
var AWS = require("aws-sdk");

var outputString = "";
var user = "";
var rejectString = "Sorry, you are not a registered user. Please register before using SMASH.";

var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes:{
          "user": user
        },
        dialogAction: {
            type: "Close",
            fulfillmentState: "Fulfilled",
            message:{
            content:outputString,
            contentType:'PlainText'
            
            
            }
        },
    };
}
function responseManager(data,callback){
    
  data.Items.forEach(async function(item){
    outputString = JSON.stringify(item.username);
    
    });

    if(outputString == ""){
        callback(null, reject());
    }
    else
    callback(null,close());
    
} 
exports.handler = (intentRequest, context, callback, sessionAttributes) => {
        
        var slots = intentRequest.currentIntent.slots;
        
         var scanningParamaters = {
        TableName: "Personal_gradeBook",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames:{
            "#username": "username"
            },
        ExpressionAttributeValues: {
         ":username" : slots.username
            }
        };
        
        docClient.query(scanningParamaters, function(err, data){
        if(err){
            //callback(err, null);
           console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null,reject());
           
        }
        else{
            user = slots.username;
            responseManager(data, callback);
        }
});
};
function reject(sessionAttributes, fulfillmentState, message) {
    return {
        dialogAction: {
            type: "Reject",
            fulfillmentState: "Fulfilled",
            message:{
            content:rejectString,
            contentType:'PlainText'
            
            
            }
        },
    };
}