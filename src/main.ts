//console.log(process.argv[2]); argument suivant npx ts-node main.ts
// chemin d'accès pour arreter le hardcode
//const pathDataType: string = join(__dirname, "data", process.argv[2]);
import { writeFileSync, readFileSync } from "fs";
import { Message, Replacement, MessageComponents } from "./data/data-type"; //hardcode
import {
  blacklistPersonNames,
  blacklistPersonEmails,
  blacklistOrganizationNames,
} from "./data/blacklist";
import { join } from "path";
import { cloneDeep } from "lodash";

//Open files .csv containing our data (Name, emails Organization Name,  )

const rawData = readFileSync(join(__dirname, "data", process.argv[2])); //hardcode, data-to-anonymize
const dataToAnonymize: Message[] = JSON.parse(rawData.toString());

const anonData = readFileSync(join(__dirname, "data", process.argv[3])); //hardcode, anonymized-data
const AnononymAttribute = JSON.parse(anonData.toString());

const AnonymizedPersonNames: string[] = [];
const AnonymizedPersonEmails: string[] = [];
const AnonymizedOrganizationNames: string[] = [];

//Split anonymized attribute data in three categories: name, email, organization
for (const objet of AnononymAttribute) {
  AnonymizedPersonNames.push(objet.name);
  AnonymizedPersonEmails.push(objet.mail);
  AnonymizedOrganizationNames.push(objet.organization);
}

//Give the word we want to replace and the word we want to put instead
const replacement: Replacement = {
  name: {
    blacklist: blacklistPersonNames,
    anonym: AnonymizedPersonNames,
  },
  email: {
    blacklist: blacklistPersonEmails,
    anonym: AnonymizedPersonEmails,
  },
  organization: {
    blacklist: blacklistOrganizationNames,
    anonym: AnonymizedOrganizationNames,
  },
};

//recursive function which permit to explore all the message properties
//and change them if some words are blacklisted
const go_through = (
  object: MessageComponents,
  blacklist_elt: RegExp,
  anon_elt: string
) => {
  for (const key in object) {
    const k = key as keyof MessageComponents;
    //if the attribute is a string, we are looking for blacklist-elt and possibly replace it
    if (typeof object[k] === "string") {
      (object[k] as string) = (object[k] as string).replace(
        blacklist_elt,
        anon_elt
      );
    }
    //else, we apply the function on the attribute
    else {
      (object[k] as any) = go_through(
        object[k] as any,
        blacklist_elt,
        anon_elt
      );
      //no solution was found to avoid "as any"
    }
  }
  return object;
};
//for a given message, go through blacklist
const go_through_blacklist = (
  message: Message,
  blacklist: string[],
  anonAttribute: string[]
) => {
  for (const blacklist_elt of blacklist) {
    const reg = new RegExp(blacklist_elt, "gi");
    const rd = Math.floor(Math.random() * anonAttribute.length);
    message = go_through(message, reg, anonAttribute[rd]) as Message;
  }
  return message;
};
//The list of anonymized message
const dataAnonymized: Message[] = [];

//
for (const message of dataToAnonymize) {
  let message_anonymized: Message = cloneDeep(message);
  for (const key in replacement) {
    const k = key as keyof Replacement;
    message_anonymized = go_through_blacklist(
      message_anonymized,
      replacement[k].blacklist,
      replacement[k].anonym
    );
  }
  dataAnonymized.push(message_anonymized);
}

//displays the anonymized messages
console.log("The data to anonymize : ", dataToAnonymize);
console.log("The anonymized data : ", dataAnonymized);
const data = JSON.stringify(dataAnonymized);
writeFileSync(join(__dirname, "data-anonymized.json"), data);
