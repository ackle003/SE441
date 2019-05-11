'use strict';
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
var email;
var officeLocation;
var phone;
var type;
var secondaryInfo;
var outputString;

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
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function queryTable(intentRequest,callback,count){
    var name = intentRequest.currentIntent.slots.Person;
        name=toTitleCase(name);
        
        //console.log("==="+currentDateString);
        //console.log(intentRequest);
        //console.log(slots.calenderType+"   allll");

        console.log(name+"+<=====");
        
        var scanningParamaters = {
        TableName: "CSUSMContacts",//"ArtsLecturesAndCulturalEventsCalendar",//table name
        FilterExpression: "#nm = :person",
        ExpressionAttributeNames:{
            "#nm": "name"
            },
        ExpressionAttributeValues: {
         ":person": name //name to be scanned
            }
        };
        
        docClient.scan(scanningParamaters, function(err, data){
        if(err){
            console.log(err);
            //callback(err, null);
            outputString="That name could not be found";
            callback(null,close());
        }
        else{
            //callback(null, data);
            //console.log(data);
            console.log(data);
            //count=0;
            //name=data.Items.name;
            //console.log(name);
            count=data.Count;
            data.Items.forEach(async function(item){
               email=item.info.email;
               officeLocation=item.info.officeLocation;
               phone=item.info.phone;
               type=item.info.type;
               secondaryInfo=item.info.secondaryInfo;
                });
            count=data.Count;
            console.log("|||||"+name)
            //if(count==0){ 
              //  outputString="There are no events";
                //callback(null,close());
           // }
            
            }
            //count=data.Count;
        });
        
    return new Promise((resolve, reject) => {
            setTimeout(() => resolve(count), 2000);
        });
        
}//end queryTable
function responseManager(intentRequest,callback,count){
    
    var name= intentRequest.currentIntent.slots.Person;
    name=toTitleCase(name);
    if (count>0){
        //var test=type.includes('no');
        console.log(type + "<=====");
    
        if ((!type.includes('no')) && (!secondaryInfo.includes('no'))) {
            outputString = name + " is a " + type + " of " + secondaryInfo + ".";
        }
        else if ((!type.indexOf('no'))) {
            outputString = name + " is a " + type + ". ";
        }
        if (!officeLocation.includes("no")) {
            outputString = outputString + " You can find " + name + " at their office which is located at " + officeLocation + ".";
    
        }
        outputString = outputString + " Here is " + name + " contact information. ";
        if (!email.includes("no")) {
            outputString = outputString + " EMAIL: " + email;
        }
        if (!phone.includes("no")) {
            outputString = outputString + "   PHONE: " + phone;
    
        }
    }//end outer if
    else{
        outputString="I'm sorry I can't seem to find that person";
    }
    
    console.log(outputString)

    email='';
    officeLocation='';
    phone='';
    type='';
    secondaryInfo=='';
 
    name='';
    callback(null,close());
    
}


var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
exports.handler = async (intentRequest, context, callback) => {
    try {
        var count;
        count = await queryTable(intentRequest,callback,count);
        //console.log(count+"main");
        responseManager(intentRequest,callback,count);
        
        //console.log("DATA++");
    }
    catch (err) {
        //callback(err);
        //outputString="There are no events";
        //callback.close();
    }

};