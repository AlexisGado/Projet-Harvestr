//Version without blacklist

import {dataToAnonymize,Person,Message,SubMessage,Organization} from './data/data-to-anonymize';
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
        AnonymizedOrganizationNames.push(objet.Organization);
    }
    console.log("Blacklist Names",blacklistPersonNames);
    console.log("Blacklist Emails", blacklistPersonEmails);
    console.log("Blacklist Companies", blacklistOrganizationNames);
    console.log("Anonym Names",AnonymizedPersonNames); 
    console.log("Anonym Emails", AnonymizedPersonEmails); 
    console.log("Anonym Organization", AnonymizedOrganizationNames); 
    
    function anonOrga(Orga : Organization){
        var rd = Math.floor(Math.random() * AnonymizedOrganizationNames.length);
        Orga.name=AnonymizedOrganizationNames[rd];
    }

    function anonPerson(Person : Person ){
        var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
        Person.name=AnonymizedPersonNames[rd];
        Person.email=AnonymizedPersonEmails[rd];
        if (Object.keys(Person).includes("organization")){
            anonOrga(Person.organization!)
        }
    }

    function anonMessage(Message : Message) {
        anonPerson(Message.requester);
        anonPerson(Message.submitter);
    }
        

    for (var message of dataToAnonymize){
        anonMessage(message);
    }
        
        

    
    //displays the anonymized messages 
    console.log("The anonymized data : ", dataToAnonymize);
    console.log("Zoom on an organization : ", dataToAnonymize[0].submitter.organization!);
}