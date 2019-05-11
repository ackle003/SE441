
'use strict';
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
var table = "Personal_gradeBook";
var outputString = " ";
var assignString = " ";
function writeToTable(intentRequest,callback)
{
    var slots = intentRequest.currentIntent.slots;
    assignString = slots.assignment + slots.assignNum + ": "+ slots.grade;
    
    var params = {
        TableName: table,
        Item:{
            "username": slots.username,
            "course": slots.course,
            "grades":{
                "assignment": assignString
                
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
        outputString = "Successfully added grades.";
        responseManager(callback);
        }
    });
    return new Promise((resolve, reject) => {
        });
    
}//end write to Table
exports.handler = async (intentRequest, context, callback) => {
    try {
       // var data = checkTable(intentRequest, callback);
        
        
       var written = await writeToTable(intentRequest,callback);
        //console.log(count+"main");
        //responseManager(intentRequest,callback,count);
        responseManager(close());
        //console.log("DATA++");
    }
    catch (err) {
        //callback(err);
        //outputString="There are no events";
        //callback.close();
    }

};
function responseManager(callback){
    outputString += assignString;
    outputString += " added to gradeBook";
    callback(null,close());
    
} 

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