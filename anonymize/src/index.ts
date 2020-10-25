import {dataToAnonymize} from './data/data-to-anonymize';
import {blackListElements} from './data/blacklist';

var AnonymizedPersonNames:string[] =["Hubert Dupont", "Sandrine Martin","Jean Le Hénaff" ];
var AnonymizedPersonEmails:string[]=["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames:string[]=["Monoprix","Paul","Imagine"];



var anonymizedAttributes:string []=[...AnonymizedPersonNames, ...AnonymizedPersonEmails,...AnonymizedCompanyNames]

var correspondance = new Map()
for (var i=0; i< anonymizedAttributes.length;i++){
    correspondance.set(blackListElements[i],anonymizedAttributes[i])
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
