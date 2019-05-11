 import requests
from lxml import html
import re
import boto3
import json


def sendToTextFile(allEventInfo,file):
    file.write(allEventInfo[2])
    file.write("\n")
    file.write(allEventInfo[0])
    file.write("\n")
    file.write(allEventInfo[1])
    file.write("\n")
    file.write(allEventInfo[3])
    file.write("\n")
    file.write(allEventInfo[4])
    file.write("\n")
    


def parseEvent(eventTitle,eventString,file):
    allEventInfoList=[]
    allEventInfoList.append(eventTitle)
    eventString = re.sub(u"(<[brp\/]*>)|(&[nbspndash;]*)",u"|",eventString)
    temp=''
    writeLock=False
    itemsRead=0;
    minimumSize=2;
    for elem in range(len(eventString)):
        if (eventString[elem] == '|') :
                if len(temp) > minimumSize:
                    allEventInfoList.append(temp)
                    itemsRead=itemsRead+1
                    temp=''
                    #print('hi')
            
            #writeLock=True
        elif (writeLock==False) and (itemsRead<=2):
            if(eventString[elem] != "|" and  eventString[elem] != "  "):
                temp=temp+eventString[elem] 
            #print(temp)
        if(itemsRead >= 1):
            break


    regDateObj=re.search("(\w+\s\d+,\s\d{4})",eventString)
    allEventInfoList.append(regDateObj.group(1))
    index=regDateObj.end(1)
    
    index=index+2
    #print(index)
    exitFlag=False
    itemsRead=0
    while exitFlag!=True:
        if(eventString[index] != "|") :
                temp=temp+eventString[index]
        elif((eventString[index] == "|") and (temp != '')):
                allEventInfoList.append(temp)
                itemsRead=itemsRead+1
                temp=''
        if itemsRead==2:
            exitFlag=True
        index=index+1
    
    #print('hi')
    #print(regDateObj)
    #print(temp)
    print(allEventInfoList)
    sendToTextFile(allEventInfoList,file)

           

def scrape(webAddress,file):
    page = requests.get(webAddress)                        
    tree= html.fromstring(page.content)
    eventsTitleList=tree.xpath('//feed//entry//title[@type="text"]/text()')
    eventsAllStatsList=tree.xpath('//feed//entry//content[@type="html"]/text()')
    for i in range(len(eventsTitleList)):
        parseEvent(eventsTitleList[i],eventsAllStatsList[i],file)



def lambda_handler():
    # TODO implement
    f= open("ArtsLecturesAndCulturalEventsCalendar.txt","w+")
    scrape("https://25livepub.collegenet.com/calendars/CSUSM-arts-lectures-and-cultural-events-calendar.xml",f)
    f.close()
    
    f= open("AthleticsCalendar.txt","w+")
    scrape("https://25livepub.collegenet.com/calendars/CSUSM-athletic-calendar.xml",f)
    f.close()

    f= open("CommunityCalendar.txt","w+")
    scrape("https://25livepub.collegenet.com/calendars/CSUSM-alumni-donors-and-friends-calendar.xml",f)
    f.close()

    f= open("MeetingCalendar.txt","w+")
    scrape("https://25livepub.collegenet.com/calendars/CSUSM-meetings.xml",f)
    f.close()


    f= open("StudentCalendar.txt","w+")
    scrape("https://25livepub.collegenet.com/calendars/CSUSM-student-calendar.xml",f)
    f.close()

    return {
        'statusCode': 200,
        'body': json.dumps('SUCCESS')
    }

lambda_handler()





