import {dataToAnonymize} from './data/data-to-anonymize';
import {blacklistPersonNames, blacklistPersonEmails, blacklistCompanyNames} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';

//Open files .csv containing our data (Name, emails Company Name,  )
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var dictionnary:any[] = [];

const myPath = path.join(__dirname,'../noms.csv')
const csvStream = fs.createReadStream(myPath).pipe(csv());

csvStream.on('data', (data:string) =>{ 
    dictionnary.push(data);
});

csvStream.on('end', () => {
    onDataReadFinished();
  });

const onDataReadFinished=()=>{
    var AnonymizedPersonNames:string[] =[];
    //Convert dictionnary in an array AnonymizedPersonNames
    for (var objet of dictionnary)
    {
        AnonymizedPersonNames.push(objet.Nom);
    }
    var AnonymizedPersonEmails:string[]=["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
    var AnonymizedCompanyNames:string[]=["Monoprix","Paul","Imagine"];

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