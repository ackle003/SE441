'use strict';
     
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
var outputString = "";

function close(sessionAttributes, fulfillmentState, message) {
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

function responseManager(data,callback){
    var temp = "";
    var temp1 = "";
    data.Items.forEach(async function(item){
    temp1 = JSON.stringify(item.grades);
    temp1 = temp1.substring(15, temp1.length - 2);
    temp += temp1;
    outputString += temp + " ";
    }
    );
    callback(null,close());
    
} 


// --------------- Main handler -----------------------
var AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
 exports.handler = (intentRequest, context, callback) => {
        
        var slots = intentRequest.currentIntent.slots;
         var scanningParamaters = {
        TableName: "Personal_gradeBook",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames:{
            "#username": "username",
            //"#course": "course"
            },
        ExpressionAttributeValues: {
         ":username" : "ackle003",     
        // ":course": slots.course
            }
        };
        
        docClient.query(scanningParamaters, function(err, data){
        if(err){
            //callback(err, null);
           console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null,close());
        }
        else{
            responseManager(data,callback);
        }
});
};
