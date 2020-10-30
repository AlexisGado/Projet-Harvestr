import {dataToAnonymize} from './data/data-to-anonymize';
import {blacklistPersonNames, blacklistPersonEmails, blacklistOrganizationNames} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';
import csvParser from 'csv-parser';

//Open files .csv containing our data (Name, emails Organization Name,  )
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var AnononymAttribute:any[]= [];

const myPath = path.join(__dirname,'../anon-data.csv')
const csvStream = fs.createReadStream(myPath).pipe(csvParser());
csvStream.on('data', (data:string)=> {
    AnononymAttribute.push(data);
    // use row data
});

csvStream.on('end', () => {
    onDataReadFinished();
  });

const onDataReadFinished=()=>{
    var AnonymizedPersonNames:string[]=[]
    var AnonymizedPersonEmails:string[]=[]
    var AnonymizedOrganizationNames:string[]=[]
    //Convert dictionnary in an array AnonymizedPersonNames
    for (var objet of AnononymAttribute)
    {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization)
    }
    console.log("Blacklist Names",blacklistPersonNames);
    console.log("Blacklist Emails", blacklistPersonEmails);
    console.log("Blacklist Companies", blacklistOrganizationNames);
    console.log("Anonym Names",AnonymizedPersonNames); 
    console.log("Anonym Emails", AnonymizedPersonEmails); 
    console.log("Anonym Organization", AnonymizedOrganizationNames); 


    for (var message of dataToAnonymize){
        
        for (var black_listed_name of blacklistPersonNames){
            var reg = new RegExp(black_listed_name,'gi');
            var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
            message.requester.name=message.requester.name.replace(reg,AnonymizedPersonNames[rd]);
            message.submitter.name=message.submitter.name.replace(reg,AnonymizedPersonNames[rd]);
            if (Object.keys(message).includes("content")){
                message.content=message.content!.replace(reg,AnonymizedPersonNames[rd]);
            }
        }

        for (var black_listed_mail of blacklistPersonEmails){
            var reg = new RegExp(black_listed_mail,'gi');
            var rd = Math.floor(Math.random() * AnonymizedPersonEmails.length);
            message.requester.email=message.requester.email.replace(reg,AnonymizedPersonEmails[rd]);
            message.submitter.email=message.submitter.email.replace(reg,AnonymizedPersonEmails[rd]);              
            if (Object.keys(message).includes("content")){
                message.content=message.content!.replace(reg,AnonymizedPersonEmails[rd]);
            }
        }

        for (var black_listed_company of blacklistOrganizationNames){
            var reg = new RegExp(black_listed_company,'gi');
            var rd = Math.floor(Math.random() * AnonymizedOrganizationNames.length);
            if (Object.keys(message.requester).includes("organization")){
                message.requester.organization!.name=message.requester.organization!.name.replace(reg,AnonymizedOrganizationNames[rd]);
            }
            if (Object.keys(message.submitter).includes("organization")){
                message.submitter.organization!.name=message.submitter.organization!.name.replace(reg,AnonymizedOrganizationNames[rd]);
            }
            if (Object.keys(message).includes("content")){
                message.content=message.content!.replace(reg,AnonymizedOrganizationNames[rd]);
            }
        } 
    }

    
    //displays the anonymized messages 
    console.log("The anonymized data : ", dataToAnonymize);
    console.log("Zoom on an organization : ", dataToAnonymize[0].submitter.organization!);
}