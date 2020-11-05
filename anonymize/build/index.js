"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_to_anonymize_1 = require("./data/data-to-anonymize");
const blacklist_1 = require("./data/blacklist");
const csv_parser_1 = __importDefault(require("csv-parser"));
var cloneDeep = require('lodash.clonedeep');
//Open files .csv containing our data (Name, emails Organization Name,  )
const fs = require("fs");
const csv = require("csv-parser");
const path = require('path');
var AnononymAttribute = [];
const myPath = path.join(__dirname, '../anon-data.csv');
const csvStream = fs.createReadStream(myPath).pipe(csv_parser_1.default());
csvStream.on('data', (data) => {
    AnononymAttribute.push(data);
    // use row data
});
csvStream.on('end', () => {
    onDataReadFinished();
});
const onDataReadFinished = () => {
    var AnonymizedPersonNames = [];
    var AnonymizedPersonEmails = [];
    var AnonymizedOrganizationNames = [];
    //Convert dictionnary in an array AnonymizedPersonNames
    for (var objet of AnononymAttribute) {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization);
    }
    const replacement = {
        name: { blacklist: blacklist_1.blacklistPersonNames, anonym: AnonymizedPersonNames },
        email: { blacklist: blacklist_1.blacklistPersonEmails, anonym: AnonymizedPersonEmails },
        organization: { blacklist: blacklist_1.blacklistOrganizationNames, anonym: AnonymizedOrganizationNames }
    };
    console.log("Blacklist Names", blacklist_1.blacklistPersonNames);
    console.log("Blacklist Emails", blacklist_1.blacklistPersonEmails);
    console.log("Blacklist Companies", blacklist_1.blacklistOrganizationNames);
    console.log("Anonym Names", AnonymizedPersonNames);
    console.log("Anonym Emails", AnonymizedPersonEmails);
    console.log("Anonym Organization", AnonymizedOrganizationNames);
    function walking(object, blacklist_elt, anon_elt) {
        for (const key in object) {
            const k = key;
            if (typeof object[k] === "string") {
                object[k] = object[k].replace(blacklist_elt, anon_elt);
                console.log(object[k]);
            }
            else {
                object[k] = walking(object[k], blacklist_elt, anon_elt);
                //no solution was found to avoid "as any"
            }
        }
        return object;
    }
    function walking_blacklist(message, blacklist, anonAttribute) {
        for (var blacklist_elt of blacklist) {
            var reg = new RegExp(blacklist_elt, 'gi');
            var rd = Math.floor(Math.random() * anonAttribute.length);
            message = walking(message, reg, anonAttribute[rd]);
        }
        return message;
    }
    var dataAnonymized = [];
    for (var message of data_to_anonymize_1.dataToAnonymize) {
        var message_anonymized = cloneDeep(message);
        for (const key in replacement) {
            const k = key;
            message_anonymized = walking_blacklist(message_anonymized, replacement[k].blacklist, replacement[k].anonym);
        }
        dataAnonymized.push(message_anonymized);
    }
    //displays the anonymized messages 
    console.log("The data to anonymize : ", data_to_anonymize_1.dataToAnonymize);
    console.log("The anonymized data : ", dataAnonymized);
    console.log("Zoom on an organization : ", dataAnonymized[0].submitter.organization);
    console.log("Zoom on submessages : ", dataAnonymized[0].sub_messages);
};
