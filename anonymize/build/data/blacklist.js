"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blackListElements = void 0;
var blacklistPersonNames = ["Elon Musk", "Jean Dujardin", "Steve Jobs"];
var blacklistPersonEmails = ["elon.musk@tesla.com", "jean.dujardin@oss.fr", "steve.jobs@rip.com"];
;
var blacklistCompanyNames = ["Paypal", "Hollywood", "Apple"];
// Please note: tripledots used below is called spread operator in javascript, it acts as an array concatenation in the example below
exports.blackListElements = __spreadArrays(blacklistPersonNames, blacklistPersonEmails, blacklistCompanyNames);
