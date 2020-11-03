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
    console.log("Blacklist Names", blacklist_1.blacklistPersonNames);
    console.log("Blacklist Emails", blacklist_1.blacklistPersonEmails);
    console.log("Blacklist Companies", blacklist_1.blacklistOrganizationNames);
    console.log("Anonym Names", AnonymizedPersonNames);
    console.log("Anonym Emails", AnonymizedPersonEmails);
    console.log("Anonym Organization", AnonymizedOrganizationNames);
    function replace(attribute_to_anonymize, blacklist_elt, anon_elt) {
        if (typeof attribute_to_anonymize === "string") {
            return attribute_to_anonymize.replace(blacklist_elt, anon_elt);
        }
    }
    function walking_organization(organization, blacklist_elt, anon_elt) {
        for (const key in organization) {
            const k = key;
            if (typeof organization[k] === "string") {
                organization[k].replace(blacklist_elt, anon_elt);
            }
        }
        return organization;
    }
    function walking_person(person, blacklist_elt, anon_elt) {
        for (const key in person) {
            const k = key;
            if (typeof person[k] === "string") {
                person[k].replace(blacklist_elt, anon_elt);
            }
        }
        if (person.organization) {
            person.organization = walking_organization(person.organization, blacklist_elt, anon_elt);
        }
        return person;
    }
    function walking_message(message, blacklist_elt, anon_elt) {
        for (const key in message) {
            const k = key;
            if (typeof message[k] === "string") {
                message[k].replace(blacklist_elt, anon_elt);
            }
        }
        for (var person of [message.requester, message.submitter]) {
            person = walking_person(person, blacklist_elt, anon_elt);
        }
        if (message.sub_messages) {
            for (var submessage of message.sub_messages) {
                submessage = walking_submessage(submessage, blacklist_elt, anon_elt);
            }
        }
        return message;
    }
    function walking_submessage(submessage, blacklist_elt, anon_elt) {
        for (const key in submessage) {
            const k = key;
            if (typeof submessage[k] === "string") {
                submessage[k].replace(blacklist_elt, anon_elt);
            }
        }
        submessage.submitter = walking_person(submessage.submitter, blacklist_elt, anon_elt);
        return submessage;
    }
    function walking_blacklist(message, blacklist, anonAttribute) {
        for (var blacklist_elt of blacklist) {
            var reg = new RegExp(blacklist_elt, 'gi');
            var rd = Math.floor(Math.random() * anonAttribute.length);
            message = walking_message(message, reg, anonAttribute[rd]);
        }
        return message;
    }
    const replacement = {
        name: { blacklist: blacklist_1.blacklistPersonNames, anonym: AnonymizedPersonNames },
        email: { blacklist: blacklist_1.blacklistPersonEmails, anonym: AnonymizedPersonEmails },
        organization: { blacklist: blacklist_1.blacklistOrganizationNames, anonym: AnonymizedOrganizationNames }
    };
    var dataAnonymized = [];
    for (var message of data_to_anonymize_1.dataToAnonymize) {
        var message_copy = cloneDeep(message);
        var message_anonymized;
        for (const key in replacement) {
            const k = key;
            message_anonymized = walking_blacklist(message_copy, replacement[k].blacklist, replacement[k].anonym);
        }
        dataAnonymized.push(message_anonymized);
    }
    //displays the anonymized messages 
    console.log("The anonymized data : ", dataAnonymized);
    console.log("Zoom on an organization : ", dataAnonymized[0].submitter.organization);
};
