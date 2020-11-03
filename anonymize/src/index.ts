import {dataToAnonymize,Message,Person,Organization,SubMessage} from './data/data-to-anonymize';
import {blacklistPersonNames, blacklistPersonEmails, blacklistOrganizationNames} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';
import csvParser from 'csv-parser';
import { Interface } from 'readline';
var cloneDeep = require('lodash.clonedeep');

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

    // function replace(attribute_to_anonymize:string,blacklist_elt:RegExp,anon_elt:string){
    //     return attribute_to_anonymize.replace(blacklist_elt,anon_elt);
    // }

    function walking_organization(organization:Organization,blacklist_elt:RegExp,anon_elt:string){
        for (const key in organization){
            const k=key as keyof Organization;
            if (typeof organization[k]==="string"){
                organization[k] = organization[k].replace(blacklist_elt,anon_elt);
            }
        }
        return organization;
    }

    function walking_person(person:Person,blacklist_elt:RegExp,anon_elt:string){
        for (const key in person){
            const k=key as keyof Person;
            if (typeof person[k]==="string"){
                (person[k] as string) = (person[k] as string).replace(blacklist_elt,anon_elt);
            }
        }
        if (person.organization){
            person.organization=walking_organization(person.organization,blacklist_elt,anon_elt)
        }
        return person;
    }

    function walking_message(message:Message,blacklist_elt:RegExp,anon_elt:string){
        for (const key in message){
            const k=key as keyof Message;
            if (typeof message[k]==="string"){
                (message[k] as string) = (message[k] as string).replace(blacklist_elt,anon_elt);
            }
        }
        for (var person of [message.requester,message.submitter]){
            person=walking_person(person,blacklist_elt,anon_elt);
        }
        if (message.sub_messages){
            for (var submessage of message.sub_messages){
                submessage=walking_submessage(submessage,blacklist_elt,anon_elt);
            }
        }
        return message;
    }
    
    function walking_submessage(submessage:SubMessage,blacklist_elt:RegExp,anon_elt:string){
        for (const key in submessage){
            const k=key as keyof SubMessage;
            if (typeof submessage[k]==="string"){
                (submessage[k] as string) = (submessage[k] as string).replace(blacklist_elt,anon_elt);
            }
        }
        submessage.submitter=walking_person(submessage.submitter,blacklist_elt,anon_elt);
        return submessage;
    }
    
    function walking_blacklist(message:Message, blacklist:string[],anonAttribute:string[]){
        for (var blacklist_elt of blacklist){
            var reg = new RegExp(blacklist_elt,'gi');
            var rd = Math.floor(Math.random() * anonAttribute.length);
            message=walking_message(message,reg,anonAttribute[rd])
        }
        return message
    }

    interface  ReplacementSlot{
        blacklist : string[];
        anonym : string[];
    }

    interface Replacement
    {
        name : ReplacementSlot;
        email : ReplacementSlot;
        organization :ReplacementSlot;
    }

    const replacement : Replacement = {
        name : { blacklist : blacklistPersonNames, anonym : AnonymizedPersonNames},
        email : { blacklist : blacklistPersonEmails, anonym : AnonymizedPersonEmails },
        organization :{ blacklist : blacklistOrganizationNames, anonym : AnonymizedOrganizationNames }            
    }; 
    
    var dataAnonymized:Message[] = [];

    for (var message of dataToAnonymize){
        var message_anonymized:Message = cloneDeep(message);
        for (const key in replacement)
        {
            const k=key as keyof Replacement;
            message_anonymized=walking_blacklist(message_anonymized,replacement[k].blacklist,replacement[k].anonym);
        }
        dataAnonymized.push(message_anonymized);
    }

    //displays the anonymized messages 
    console.log("The data to anonymize : ", dataToAnonymize);
    console.log("The anonymized data : ", dataAnonymized);
    console.log("Zoom on an organization : ", dataAnonymized[0].submitter.organization!);
}