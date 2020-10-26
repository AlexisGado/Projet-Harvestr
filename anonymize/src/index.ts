import {dataToAnonymize} from './data/data-to-anonymize';
import {blackListElements} from './data/blacklist';

var AnonymizedPersonNames:string[] =["Hubert Dupont", "Sandrine Martin","Jean Le Hénaff" ];
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
