import {dataToAnonymize} from './data/data-to-anonymize';
import {blackListElements} from './data/blacklist';

var AnonymizedPersonNames:string[] =["Hubert Dupont, Sandrine Martin","Jean Le Hénaff" ];
var AnonymizedPersonEmails:string[]=["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames:string[]=["Monoprix","Paul","Imagine"];

var correspondance = new Map([["Elon Musk","Jean Le Hénaff"],["Zizou","Jon"]])

var data_string:string = JSON.stringify(dataToAnonymize);

console.log(data_string);



for (var black_listed of blackListElements)
{
    var reg = new RegExp(black_listed,'gi');
    data_string  = data_string.replace(reg,correspondance.get(black_listed)!);
}

console.log(JSON.parse(data_string));
