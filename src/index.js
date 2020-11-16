"use strict";
exports.__esModule = true;
var data_to_anonymize_1 = require("./data/data-to-anonymize");
var blacklist_1 = require("./data/blacklist");
var csv_parser_1 = require("csv-parser");
var lodash_1 = require("lodash");
//Open files .csv containing our data (Name, emails Organization Name,  )
var fs_1 = require("fs");
var path_1 = require("path");
var AnononymAttribute = [];
var myPath = path_1.join(__dirname, "../anon-data.csv");
var csvStream = fs_1.createReadStream(myPath).pipe(csv_parser_1["default"]());
csvStream.on("data", function (data) {
    AnononymAttribute.push(data);
    // read anonymized attribute data
});
csvStream.on("end", function () {
    onDataReadFinished();
});
var onDataReadFinished = function () {
    var AnonymizedPersonNames = [];
    var AnonymizedPersonEmails = [];
    var AnonymizedOrganizationNames = [];
    //Split anonymized attribute data in three categories: name, email, organization
    for (var _i = 0, AnononymAttribute_1 = AnononymAttribute; _i < AnononymAttribute_1.length; _i++) {
        var objet = AnononymAttribute_1[_i];
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization);
    }
    //Give the word we want to replace and the word we want to put instead
    var replacement = {
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
    var go_through = function (object, blacklist_elt, anon_elt) {
        for (var key in object) {
            var k = key;
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
    var go_through_blacklist = function (message, blacklist, anonAttribute) {
        for (var _i = 0, blacklist_2 = blacklist; _i < blacklist_2.length; _i++) {
            var blacklist_elt = blacklist_2[_i];
            var reg = new RegExp(blacklist_elt, "gi");
            var rd = Math.floor(Math.random() * anonAttribute.length);
            message = go_through(message, reg, anonAttribute[rd]);
        }
        return message;
    };
    //The list of anonymized message
    var dataAnonymized = [];
    //
    for (var _a = 0, dataToAnonymize_1 = data_to_anonymize_1.dataToAnonymize; _a < dataToAnonymize_1.length; _a++) {
        var message = dataToAnonymize_1[_a];
        var message_anonymized = lodash_1.cloneDeep(message);
        for (var key in replacement) {
            var k = key;
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
