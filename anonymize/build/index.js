"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_to_anonymize_1 = require("./data/data-to-anonymize");
var blacklist_1 = require("./data/blacklist");
var AnonymizedPersonNames = ["Hubert Dupont, Sandrine Martin", "Jean Le Hénaff"];
var AnonymizedPersonEmails = ["hubert.dupont@gmail.com", "sandrine.martin54@yahoo.com", "jean.le.henaff@imagine.fr"];
var AnonymizedCompanyNames = ["Monoprix", "Paul", "Imagine"];
var correspondance = new Map([["Elon Musk", "Jean Le Hénaff"], ["Zizou", "Jon"]]);
var data_string = JSON.stringify(data_to_anonymize_1.dataToAnonymize);
console.log(data_string);
for (var _i = 0, blackListElements_1 = blacklist_1.blackListElements; _i < blackListElements_1.length; _i++) {
    var black_listed = blackListElements_1[_i];
    var reg = new RegExp(black_listed, 'gi');
    data_string = data_string.replace(reg, correspondance.get(black_listed));
}
console.log(JSON.parse(data_string));
