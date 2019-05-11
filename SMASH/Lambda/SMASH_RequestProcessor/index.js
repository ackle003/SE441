'use strict';
var AWS = require("aws-sdk");
var outputString = "";

var rejectString = "Sorry, course not found.";

var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
function close(sessionAttributes, fulfillmentState, message) {
    return {

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
    var temp = "";
  data.Items.forEach(async function(item){
    temp = JSON.stringify(item.grades);
    temp = temp.substring(15, temp.length - 2);
    outputString += temp;
    
    });

   
    callback(null,close());
    
} 
exports.handler = (intentRequest, context, callback, sessionAttributes) => {
        
        var slots = intentRequest.currentIntent.slots;
        
         var scanningParamaters = {
        TableName: "Personal_gradeBook",
        KeyConditionExpression: "#username = :username and #course = :course",
        ExpressionAttributeNames:{
            "#username": "username",
            "#course": "course"
            },
        ExpressionAttributeValues: {
         ":username" : slots.username,
         ":course": slots.course
            }
        };
        
        docClient.query(scanningParamaters, function(err, data){
        if(err){
            //callback(err, null);
           console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null,reject());
           
        }
        else{
            
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