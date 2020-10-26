import {dataToAnonymize} from './data/data-to-anonymize';
import {blackListElements} from './data/blacklist';
import { PRIORITY_BELOW_NORMAL } from 'constants';


const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var results:any[] = [];

const myPath = path.join(__dirname,'../noms.csv')

fs.createReadStream(myPath).pipe(csv()).on('data', (data:string) => results.push(data));


var AnonymizedPersonNames:string[] =[];

for (var objet of results)
{
    AnonymizedPersonNames.push(objet.Nom);
}
console.log(results);
console.log(AnonymizedPersonNames);

var AnonymizedPersonEmails:string[]=["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames:string[]=["Monoprix","Paul","Imagine"];


var anonymizedAttributes:string []=[...AnonymizedPersonNames, ...AnonymizedPersonEmails,...AnonymizedCompanyNames]


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
console.log(correspondance)

var data_string:string = JSON.stringify(dataToAnonymize);

console.log(dataToAnonymize);

for (var black_listed of blackListElements)
{
    var reg = new RegExp(black_listed,'gi');
    data_string  = data_string.replace(reg,correspondance.get(black_listed)!);
}

var anonymizedData=JSON.parse(data_string);

console.log(anonymizedData);
