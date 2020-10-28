import {dataToAnonymize} from './data/data-to-anonymize';
import {blacklistPersonNames, blacklistPersonEmails, blacklistCompanyNames} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';
import csvParser from 'csv-parser';

//Open files .csv containing our data (Name, emails Company Name,  )
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var AnononymNamesEmails:any[]= [];

const myPath = path.join(__dirname,'../anon-data.csv')
const csvStream = fs.createReadStream(myPath).pipe(csvParser());
csvStream.on('data', (data:string)=> {
    AnononymNamesEmails.push(data);
    // use row data
});

csvStream.on('end', () => {
    onDataReadFinished();
  });

const onDataReadFinished=()=>{
    var AnonymizedPersonNames:string[]=[]
    var AnonymizedPersonEmails:string[]=[]
    var AnonymizedCompanyNames:string[]=[]
    //Convert dictionnary in an array AnonymizedPersonNames
    for (var objet of AnononymNamesEmails)
    {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedCompanyNames.push(objet.Company)
    }

    console.log(AnonymizedPersonNames); 
    console.log(AnonymizedPersonEmails); 
    console.log(AnonymizedCompanyNames); 

    var data_string:string = JSON.stringify(dataToAnonymize);

    //displays the message we want to anonymize
    console.log("The data to anonymize : ", dataToAnonymize);

    //walk the blacklist and replace by its anonymized correspondance

    for (var black_listed_name of blacklistPersonNames){
        var reg = new RegExp(black_listed_name,'gi');
        var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
        data_string  = data_string.replace(reg,AnonymizedPersonNames[rd]);
    }

    for (var black_listed_mail of blacklistPersonEmails){
        var reg = new RegExp(black_listed_mail,'gi');
        var rd = Math.floor(Math.random() * AnonymizedPersonEmails.length);
        data_string  = data_string.replace(reg,AnonymizedPersonEmails[rd]);
    }

    for (var black_listed_company of blacklistCompanyNames){
        var reg = new RegExp(black_listed_company,'gi');
        var rd = Math.floor(Math.random() * AnonymizedCompanyNames.length);
        data_string  = data_string.replace(reg,AnonymizedCompanyNames[rd]);
    }

    var anonymizedData=JSON.parse(data_string);

    //displays the anonymized messages 
    console.log("The anonymized data : ", anonymizedData);
}