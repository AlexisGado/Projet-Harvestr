"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_to_anonymize_1 = require("./data/data-to-anonymize");
const blacklist_1 = require("./data/blacklist");
const csv_parser_1 = __importDefault(require("csv-parser"));
const lodash_1 = require("lodash");
//Open files .csv containing our data (Name, emails Organization Name,  )
const fs_1 = require("fs");
const path_1 = require("path");
const AnononymAttribute = [];
const myPath = path_1.join(__dirname, "../anon-data.csv");
const csvStream = fs_1.createReadStream(myPath).pipe(csv_parser_1.default());
csvStream.on("data", (data) => {
    AnononymAttribute.push(data);
    // read anonymized attribute data
});
csvStream.on("end", () => {
    onDataReadFinished();
});
const onDataReadFinished = () => {
    const AnonymizedPersonNames = [];
    const AnonymizedPersonEmails = [];
    const AnonymizedOrganizationNames = [];
    //Split anonymized attribute data in three categories: name, email, organization
    for (const objet of AnononymAttribute) {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization);
    }
    //Give the word we want to replace and the word we want to put instead
    const replacement = {
        name: {
            blacklist: blacklist_1.blacklistPersonNames,
            anonym: AnonymizedPersonNames
        },
        email: {
            blacklist: blacklist_1.blacklistPersonEmails,
            anonym: AnonymizedPersonEmails
        },
        organization: {
            blacklist: blacklist_1.blacklistOrganizationNames,
            anonym: AnonymizedOrganizationNames
        }
    };
    /*console.log("Blacklist Names",blacklistPersonNames);
    console.log("Blacklist Emails", blacklistPersonEmails);
    console.log("Blacklist Companies", blacklistOrganizationNames);
    console.log("Anonym Names",AnonymizedPersonNames);
    console.log("Anonym Emails", AnonymizedPersonEmails);
    console.log("Anonym Organization", AnonymizedOrganizationNames); */
    //recursive function which permit to explore all the message properties
    //and change them if some words are blacklisted
    const go_through = (object, blacklist_elt, anon_elt) => {
        for (const key in object) {
            const k = key;
            //if the attribute is a string, we are looking for blacklist-elt and possibly replace it
            if (typeof object[k] === "string") {
                object[k] = object[k].replace(blacklist_elt, anon_elt);
            }
            //else, we apply the function on the attribute
            else {
                object[k] = go_through(object[k], blacklist_elt, anon_elt);
                //no solution was found to avoid "as any"
            }
        }
        return object;
    };
    //for a given message, go through blacklist
    const go_through_blacklist = (message, blacklist, anonAttribute) => {
        for (const blacklist_elt of blacklist) {
            const reg = new RegExp(blacklist_elt, "gi");
            const rd = Math.floor(Math.random() * anonAttribute.length);
            message = go_through(message, reg, anonAttribute[rd]);
        }
        return message;
    };
    //The list of anonymized message
    const dataAnonymized = [];
    //
    for (const message of data_to_anonymize_1.dataToAnonymize) {
        let message_anonymized = lodash_1.cloneDeep(message);
        for (const key in replacement) {
            const k = key;
            message_anonymized = go_through_blacklist(message_anonymized, replacement[k].blacklist, replacement[k].anonym);
        }
        dataAnonymized.push(message_anonymized);
    }
    //displays the anonymized messages
    console.log("The data to anonymize : ", data_to_anonymize_1.dataToAnonymize);
    console.log("The anonymized data : ", dataAnonymized);
    console.log("Zoom on an organization : ", dataAnonymized[0].submitter.organization);
    console.log("Zoom on submessages : ", dataAnonymized[0].sub_messages);
};
//# sourceMappingURL=index.js.map