import {dataToAnonymize} from './data/data-to-anonymize';
import {blackListElements} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';

//Open files .csv containing our data (Name, emails Company Name,  )
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var dictionnary:any[] = [];

const myPath = path.join(__dirname,'../noms.csv')
fs.createReadStream(myPath).pipe(csv()).on('data', (data:string) => dictionnary.push(data));


var AnonymizedPersonNames:string[] =[];
 //Convert dictionnary in an array AnonymizedPersonNames
for (var objet of dictionnary)
{
    AnonymizedPersonNames.push(objet.Nom);
}
console.log("This is the dictionnary:", dictionnary);
console.log("This is the list of anonymized names : ", AnonymizedPersonNames);

var AnonymizedPersonEmails:string[]=["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames:string[]=["Monoprix","Paul","Imagine"];

//Try to associate an anonymized element 
//to each element of the blacklist adapted to its type (name,mail, company name)
var correspondance = new Map()
for (var black_listed of blackListElements){

    if (correspondance.get(black_listed) == null){
        if (black_listed.includes("@")){
            var rd = Math.floor(Math.random() * AnonymizedPersonEmails.length);
            correspondance.set(black_listed,AnonymizedPersonEmails[rd])
            AnonymizedPersonEmails.splice(rd,1);
        }
        else{ 
            if (black_listed.includes(" ")){
                var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
                correspondance.set(black_listed,AnonymizedPersonNames[rd])
                AnonymizedPersonNames.splice(rd,1);
            }
            else{
                var rd = Math.floor(Math.random() * AnonymizedCompanyNames.length);
                correspondance.set(black_listed,AnonymizedCompanyNames[rd])
                AnonymizedCompanyNames.splice(rd,1);
            }
        }
    }
}
console.log("The correspondance between blacklist and anonymized data : ", correspondance)

var data_string:string = JSON.stringify(dataToAnonymize);

//displays the message we want to anonymize
console.log("The data to anonymize : ", dataToAnonymize);

//walk the blacklist and replace by its anonymized correspondance
for (var black_listed of blackListElements)
{
    var reg = new RegExp(black_listed,'gi');
    data_string  = data_string.replace(reg,correspondance.get(black_listed)!);
}

var anonymizedData=JSON.parse(data_string);

//displays the anonymized messages 
console.log("The anonymized data : ", anonymizedData);
