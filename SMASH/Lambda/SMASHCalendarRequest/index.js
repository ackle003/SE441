'use strict';
     
// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")

function alexaResponse(callback){
var responseJson =  {
    version: "1.0",
    response: {
      outputSpeech: 
       {
         type: "PlainText",
         text: outputString, 
       },
      shouldEndSession: true
      },
      sessionAttributes: {}
    };
    callback(null,responseJson);
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



function determineType(calendar)
{
    
    //console.log("asdadsa");
    //var calendar_type = ['ArtsLecturesAndCulturalEventsCalendar', 'MeetingCalendar', 'AthleticsCalendar','StudentEventsCalendar','CommunityCalendar'];
    //if (calendar != null)
     calendar=calendar.toLowerCase();
    
    var valid_Slot0=["art","lectures","cultural","art calendar","lectures calendar","cultural calendar"];
    var valid_Slot1=["meeting","meeting calendar"];
    var valid_Slot2=["athletics","athletics calendar"];
    var valid_Slot3=["student events","student events calendar", "events","events calendar"];
    var valid_Slot4=["community","community calendar"];
    
    //var validFlag=false;
   // console.log(valid_Slot0.length+"asdadsa");
    for (var i=0; i< valid_Slot0.length;i++){
        if (calendar==valid_Slot0[i]){
            calendar="ArtsLecturesAndCulturalEventsCalendar";
            //validFlag=true;
        }
    }
    
    for (var i=0; i< valid_Slot1.length;i++){
        if (calendar==valid_Slot1[i]){
            calendar="MeetingCalendar";
            //validFlag=true;
        }
    }
            
    for (var i=0; i< valid_Slot2.length;i++){
        if (calendar==valid_Slot2[i]){
            calendar="AthleticsCalendar";
            //validFlag=true;
        }
    }
    
    for (var i=0; i< valid_Slot3.length;i++){
        if (calendar==valid_Slot3[i]){
            calendar="StudentEventsCalendar";
            //validFlag=true;
        }
    }
            
    for (var i=0; i< valid_Slot4.length;i++){
        if (calendar==valid_Slot4[i]){
            calendar="CommunityCalendar";
            //validFlag=true;
        }
    }
    console.log(calendar+ "inside type");
    return calendar;
}

function getCount(data){
    var count=data.Count
    return new Promise(function(resolve, reject){
        resolve(count);
})
};

function queryTable(intentRequest,callback,count){
    var calendar;  
    var slots = intentRequest.currentIntent.slots;
        //console.log("==="+currentDateString);
        //console.log(intentRequest);
        //console.log(slots.calenderType+"   allll");
        calendar=slots.CalendarType;
        calendar=determineType(calendar);
        console.log(calendar+"allll");
        
        var scanningParamaters = {
        TableName: calendar,//"ArtsLecturesAndCulturalEventsCalendar",//table name
        KeyConditionExpression: "#date = :date",
        ExpressionAttributeNames:{
            "#date": "date"
            },
        ExpressionAttributeValues: {
         ":date": currentDateString //date to be scanned
            }
        };
        
        docClient.query(scanningParamaters, function(err, data){
        if(err){
            //callback(err, null);
            outputString="There are no events";
            callback(null,close());
        }
        else{
            //callback(null, data);
            //console.log(data);
            console.log(data);
            //count=0;
            count=data.Count;
            data.Items.forEach(async function(item){
                //console.log(" -", item.info.location,item.info.start);
                eventLocation.push(item.info.location);
                eventStart.push(item.info.start);
                eventEnd.push(item.info.end);
                eventTitle.push(item.info.title);
                //count=item.count;
                //
                //count=count+1;
                });
            //console.log("|||||"+count)
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
    var allCheck = intentRequest.currentIntent.slots.all;
    console.log(allCheck+"{P{P{{{{{{{[");
    if ((count>5) && (allCheck !=null))
         outputString="There are " + count + " events. " + "Here are the events.";
    else if (count>5)
    {
        outputString="There are " + count + " events. " + "Here are the first 5 events.";
        count=5;
    }
    else if (count==1)
    {
        outputString="There is one event, here is the event.";
    }
    else if (count==0){
        outputString="There are no events on that day.";
    }
    else
    {
        outputString="There are " + count + " events. " + "Here are the events.";
    }  
    for (var i =0; i< count;i++){
            formatEvents(i);
            }   
    eventLocation.length=0;
    eventStart.length=0;
    eventTitle.length=0;
    eventEnd.length=0;
    
   /// alexaResponse(callback);
    //console.log(intentRequest.confirmationStatus+"{}}{P}{P");
    callback(null,close());
    
}
 
 
 
 
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



const currentDate = new Date();
console.log(currentDate);
var currentDateString= "";
currentDateString=monthNames[currentDate.getMonth()]+" " +currentDate.getDate()+","+" "+currentDate.getFullYear();
console.log(currentDateString);

var outputString= "";
var eventLocation=[];
var eventStart=[];
var eventEnd=[];
var eventTitle=[];

//var calendar="";

//next step



function formatEvents(i){
        outputString=outputString+" There is an event called "+eventTitle[i]+". ";
        outputString=outputString+" It's located at "+ eventLocation[i]+". ";
        outputString=outputString+" It starts at "+eventStart[i]+" and ";
        outputString=outputString+"ends at "+eventEnd[i]+". "; 
        console.log(outputString);
}

// --------------- Main handler -----------------------
var AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
exports.handler = async (intentRequest, context, callback) => {
    try {
        var count;
        count= await queryTable(intentRequest,callback,count);
        console.log(count+"main");
        responseManager(intentRequest,callback,count);
        
        //console.log("DATA++");
    }
    catch (err) {
        //callback(err);
        //outputString="There are no events";
        //callback.close();
    }

};
