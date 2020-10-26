"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_to_anonymize_1 = require("./data/data-to-anonymize");
var blacklist_1 = require("./data/blacklist");
var AnonymizedPersonNames = ["Hubert Dupont", "Sandrine Martin", "Jean Le Hénaff"];
var AnonymizedPersonEmails = ["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames = ["Monoprix", "Paul", "Imagine"];
var anonymizedAttributes = __spreadArrays(AnonymizedPersonNames, AnonymizedPersonEmails, AnonymizedCompanyNames);
var correspondance = new Map();
for (var _i = 0, blackListElements_1 = blacklist_1.blackListElements; _i < blackListElements_1.length; _i++) {
    var black_listed = blackListElements_1[_i];
    if (correspondance.get(black_listed) == null) {
        if (black_listed.includes(".")) {
            var rd = Math.floor(Math.random() * AnonymizedPersonEmails.length);
            correspondance.set(black_listed, AnonymizedPersonEmails[rd]);
            AnonymizedPersonEmails.splice(rd, 1);
        }
        if (black_listed.includes(" ")) {
            var rd = Math.floor(Math.random() * AnonymizedPersonNames.length);
            correspondance.set(black_listed, AnonymizedPersonNames[rd]);
            AnonymizedPersonNames.splice(rd, 1);
        }
        else {
            var rd = Math.floor(Math.random() * AnonymizedCompanyNames.length);
            correspondance.set(black_listed, AnonymizedCompanyNames[rd]);
            AnonymizedCompanyNames.splice(rd, 1);
        }
    }
}
console.log(correspondance);
console.log(AnonymizedCompanyNames, AnonymizedPersonEmails, AnonymizedPersonNames);
var data_string = JSON.stringify(data_to_anonymize_1.dataToAnonymize);
console.log(data_to_anonymize_1.dataToAnonymize);
for (var _a = 0, blackListElements_2 = blacklist_1.blackListElements; _a < blackListElements_2.length; _a++) {
    var black_listed = blackListElements_2[_a];
    var reg = new RegExp(black_listed, 'gi');
    data_string = data_string.replace(reg, correspondance.get(black_listed));
}
var anonymizedData = JSON.parse(data_string);
console.log(anonymizedData);
