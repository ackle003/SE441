"use strict";
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
var weightString = "";
var outputString = "";
function writeToTable(intentRequest,callback)
{
    var slots = intentRequest.currentIntent.slots;
   weightString = slots.hw_weight + slots.test_weight + slots.project_weight;
    
    var params = {
        TableName: "Personal_gradeBook",
        Item:{
            "username": intentRequest.sessionAttributes.user,
            "course": slots.course,
            "weights":{
                "hw_weight": slots.hw_weight,
                "test_weight": slots.test_weight,
                "project_weight": slots.project_weight
                
                }
            }
        };
    docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        outputString = "Error, unsuccessful";
        } 
    else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        
        outputString = "Successfully added weights.";
         callback(null, close());
        }
    });
    return new Promise((resolve, reject) => {
        });
    
}//end write to Table
exports.handler = async (intentRequest, sessionAttributes, callback) => {
  
   try {
       // var data = checkTable(intentRequest, callback);
        
        
       var written = await writeToTable(intentRequest,callback);
        //console.log(count+"main");
        //responseManager(intentRequest,callback,count);
        callback(null, close());
        //console.log("DATA++");
    }
    catch (err) {
        //callback(err);
        //outputString="There are no events";
        //callback.close();
    }
        
    
};

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