import json
import boto3
import decimal
import time

dynamodb = boto3.resource('dynamodb')


def readCalendar(table,file):
    allInfo=[]
    entry = 0

    for line in open(file, 'r'):
        readLine=line
        readLine=readLine.rstrip()
        allInfo.append(readLine)
    table=dynamodb.Table(table)     
    while entry<len(allInfo):
        info1=allInfo.pop(0)
        info2=allInfo.pop(0)
        info3=allInfo.pop(0)
        info4=allInfo.pop(0)
        info5=allInfo.pop(0)
        response = table.put_item(
            Item={
                'date':info1,
                'entry':entry,
                'info': {
                    'title':info2,
                    'location':info3,
                    'start':info4,
                    'end':info5
            }
        }
        )
        entry=entry+1
        
def lambda_handler(event, context):
    # TODO implement
   
    
    table="ArtsLecturesAndCulturalEventsCalendar"
    f='ArtsLecturesAndCulturalEventsCalendar2.txt' 
    readCalendar(table,f)
    
    table="AthleticsCalendar"
    f='AthleticsCalendar2.txt'
    readCalendar(table,f)
    
    table="CommunityCalendar"
    f='CommunityCalendar.txt'
    readCalendar(table,f)
    
    table="MeetingCalendar"
    f='MeetingCalendar2.txt'
    readCalendar(table,f)
    
    table="StudentEventsCalendar"
    f='StudentCalendar2.txt'
    readCalendar(table,f)
 

    
    return {
        'statusCode': 200,
        'body': json.dumps('SUCCESS')
    }
