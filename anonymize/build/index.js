"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_to_anonymize_1 = require("./data/data-to-anonymize");
var blacklist_1 = require("./data/blacklist");
var csv_parser_1 = __importDefault(require("csv-parser"));
//Open files .csv containing our data (Name, emails Organization Name,  )
var fs = require("fs");
var csv = require("csv-parser");
var path = require('path');
var AnononymAttribute = [];
var myPath = path.join(__dirname, '../anon-data.csv');
var csvStream = fs.createReadStream(myPath).pipe(csv_parser_1.default());
csvStream.on('data', function (data) {
    AnononymAttribute.push(data);
    // use row data
});
csvStream.on('end', function () {
    onDataReadFinished();
});
var onDataReadFinished = function () {
    var AnonymizedPersonNames = [];
    var AnonymizedPersonEmails = [];
    var AnonymizedOrganizationNames = [];
    //Convert dictionnary in an array AnonymizedPersonNames
    for (var _i = 0, AnononymAttribute_1 = AnononymAttribute; _i < AnononymAttribute_1.length; _i++) {
        var objet = AnononymAttribute_1[_i];
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
    for (var _a = 0, dataToAnonymize_1 = data_to_anonymize_1.dataToAnonymize; _a < dataToAnonymize_1.length; _a++) {
        var message = dataToAnonymize_1[_a];
        for (var _b = 0, blacklistPersonNames_1 = blacklist_1.blacklistPersonNames; _b < blacklistPersonNames_1.length; _b++) {
            var black_listed_name = blacklistPersonNames_1[_b];
            var reg = new RegExp(black_listed_name, 'gi');
            var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
            message.requester.name = message.requester.name.replace(reg, AnonymizedPersonNames[rd]);
            message.submitter.name = message.submitter.name.replace(reg, AnonymizedPersonNames[rd]);
            if (Object.keys(message).includes("content")) {
                message.content = message.content.replace(reg, AnonymizedPersonNames[rd]);
            }
        }
        for (var _c = 0, blacklistPersonEmails_1 = blacklist_1.blacklistPersonEmails; _c < blacklistPersonEmails_1.length; _c++) {
            var black_listed_mail = blacklistPersonEmails_1[_c];
            var reg = new RegExp(black_listed_mail, 'gi');
            var rd = Math.floor(Math.random() * AnonymizedPersonEmails.length);
            message.requester.email = message.requester.email.replace(reg, AnonymizedPersonEmails[rd]);
            message.submitter.email = message.submitter.email.replace(reg, AnonymizedPersonEmails[rd]);
            if (Object.keys(message).includes("content")) {
                message.content = message.content.replace(reg, AnonymizedPersonEmails[rd]);
            }
        }
        for (var _d = 0, blacklistOrganizationNames_1 = blacklist_1.blacklistOrganizationNames; _d < blacklistOrganizationNames_1.length; _d++) {
            var black_listed_company = blacklistOrganizationNames_1[_d];
            var reg = new RegExp(black_listed_company, 'gi');
            var rd = Math.floor(Math.random() * AnonymizedOrganizationNames.length);
            if (Object.keys(message.requester).includes("organization")) {
                message.requester.organization.name = message.requester.organization.name.replace(reg, AnonymizedOrganizationNames[rd]);
            }
            if (Object.keys(message.submitter).includes("organization")) {
                message.submitter.organization.name = message.submitter.organization.name.replace(reg, AnonymizedOrganizationNames[rd]);
            }
            if (Object.keys(message).includes("content")) {
                message.content = message.content.replace(reg, AnonymizedOrganizationNames[rd]);
            }
        }
    }
    //displays the anonymized messages 
    console.log("The anonymized data : ", data_to_anonymize_1.dataToAnonymize);
    console.log("Zoom on an organization : ", data_to_anonymize_1.dataToAnonymize[0].submitter.organization);
};
