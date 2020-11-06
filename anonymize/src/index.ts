import {dataToAnonymize,Message,Person,Organization,SubMessage} from './data/data-to-anonymize';
import {blacklistPersonNames, blacklistPersonEmails, blacklistOrganizationNames} from './data/blacklist';
import csvParser from 'csv-parser';
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
    // read anonymized attribute data
});

csvStream.on('end', () => {
    onDataReadFinished();
  });

const onDataReadFinished=()=>{

    var AnonymizedPersonNames:string[]=[]
    var AnonymizedPersonEmails:string[]=[]
    var AnonymizedOrganizationNames:string[]=[]
    //Split anonymized attribute data in three categories: name, email, organization
    for (var objet of AnononymAttribute)
    {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization)
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
    //Give the word we want to replace and the word we want to put instead
    const replacement : Replacement = {
        name : { blacklist : blacklistPersonNames, anonym : AnonymizedPersonNames},
        email : { blacklist : blacklistPersonEmails, anonym : AnonymizedPersonEmails },
        organization :{ blacklist : blacklistOrganizationNames, anonym : AnonymizedOrganizationNames }            
    }; 

    /*console.log("Blacklist Names",blacklistPersonNames);
    console.log("Blacklist Emails", blacklistPersonEmails);
    console.log("Blacklist Companies", blacklistOrganizationNames);
    console.log("Anonym Names",AnonymizedPersonNames); 
    console.log("Anonym Emails", AnonymizedPersonEmails); 
    console.log("Anonym Organization", AnonymizedOrganizationNames); */

    type MessageComponents = Message | Person | SubMessage | Organization;

    //recursive function which permit to explore all the message properties 
    //and change them if some words are blacklisted
    function go_through(object : MessageComponents ,blacklist_elt:RegExp,anon_elt:string){
        for (const key in object){
            const k=key as keyof (Message | Person | SubMessage | Organization);
            //if the attribute is a string, we are looking for blacklist-elt and possibly replace it
            if (typeof object[k]==="string"){
                (object[k] as string) = (object[k] as string).replace(blacklist_elt,anon_elt);
            }
            //else, we apply the function on the attribute
            else{
                (object[k] as any)= go_through(object[k] as any , blacklist_elt,anon_elt) 
                //no solution was found to avoid "as any"
            }
        }
        return object;
    }
    //for a given message, go through blacklist 
    function go_through_blacklist(message:Message, blacklist:string[],anonAttribute:string[]){
        for (var blacklist_elt of blacklist){
            var reg = new RegExp(blacklist_elt,'gi');
            var rd = Math.floor(Math.random() * anonAttribute.length);
            message=go_through(message,reg,anonAttribute[rd]) as Message;
        }
        return message
    }
    //The list of anonymized message 
    var dataAnonymized:Message[] = [];

    //
    for (var message of dataToAnonymize){
        var message_anonymized:Message = cloneDeep(message);
        for (const key in replacement){
            const k=key as keyof Replacement;
            message_anonymized=go_through_blacklist(message_anonymized,replacement[k].blacklist,replacement[k].anonym);
        }
        dataAnonymized.push(message_anonymized);
    }

    //displays the anonymized messages 
    /*console.log("The data to anonymize : ", dataToAnonymize);
    console.log("The anonymized data : ", dataAnonymized);
    console.log("Zoom on an organization : ", dataAnonymized[0].submitter.organization!);
    console.log("Zoom on submessages : ", dataAnonymized[0].sub_messages!);*/
}