import json
import boto3
import decimal

dynamodb = boto3.resource('dynamodb')

def readBiology(table,file):
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
        info6=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'Biology',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':info4,
                    'email':info5,
                    'officeLocation':info6
            }
        }
        )
        entry=entry+1

def readBioTechnology(table,file):
    allInfo=[]
    entry=0
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
        info6=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'BioTechnology',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':info4,
                    'email':info5,
                    'officeLocation':info6
            }
        }
        )
        entry=entry+1

def readChemistryAndBiochemistry(table,file):
    allInfo=[]
    entry=0
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
        info6=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'Chemistry And Biochemistry',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':info4,
                    'email':info5,
                    'officeLocation':info6
            }
        }
        )
        entry=entry+1
    
def readCS(table,file):
    allInfo=[]

    for line in open(file, 'r'):
        readLine=line
        readLine=readLine.rstrip()
        allInfo.append(readLine)
    table=dynamodb.Table(table)  
    entry=0
    exitFlag=False
    while entry<len(allInfo):
        info1=allInfo.pop(0)
        if info1 ==  'CSIS Lecturers':
            exitFlag = True
            break
        print(info1)
        info2=allInfo.pop(0)
        info3=allInfo.pop(0)
        info4=allInfo.pop(0)
        info5=allInfo.pop(0)
        info6=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'Computer Science',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':info4,
                    'email':info5,
                    'officeLocation':info6
            }
        
        }
        )
        entry=entry+1
       
    
    entry=0
    while entry<len(allInfo):
        info1=allInfo.pop(0)
        info2=allInfo.pop(0)
        info3=allInfo.pop(0)
        info4=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'Computer Science',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':'no phone',
                    'email':info4,
                    'officeLocation':'no office listed'
            }
        }
        )
        entry=entry+1

def readPhysics(table,file):
    allInfo=[]

    for line in open(file, 'r'):
        readLine=line
        readLine=readLine.rstrip()
        allInfo.append(readLine)
    table=dynamodb.Table(table)  
    entry=0
    exitFlag=False
    while entry<len(allInfo):
        info1=allInfo.pop(0)
        print(info1)
        info2=allInfo.pop(0)
        info3=allInfo.pop(0)
        info4=allInfo.pop(0)
        info5=allInfo.pop(0)
        info6=allInfo.pop(0)
        response = table.put_item(
            Item={
                'department':'Physics',
                'name':info1,
                'info': {
                    'type':info2,
                    'secondaryInfo':info3,
                    'phone':info4,
                    'email':info5,
                    'officeLocation':info6
            }
        
        }
        )
        entry=entry+1
      



def lambda_handler(event, context):
    # TODO implement
    table="CSUSMContacts"

    f='Biology.txt' 
    readBiology(table,f)
    
    f='Biotechnology.txt'
    readBioTechnology(table,f)
    
    f='ChemistryAndBiochemistry.txt'
    readChemistryAndBiochemistry(table,f)
    
    f='CS.txt'
    readCS(table,f)
    
    f='Physics.txt'
    readPhysics(table,f)
 

    
    return {
        'statusCode': 200,
        'body': json.dumps('SUCCESS')
    }
