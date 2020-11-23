"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const blacklistPersonNames = [
    "Elon Musk",
    "Jean Dujardin",
    "Steve Jobs"
];
const blacklistPersonEmails = [
    "elon.musk@tesla.com",
    "jean.dujardin@oss.fr",
    "steve.jobs@rip.com"
];
const blacklistOrganizationNames = [
    "Paypal",
    "Hollywood",
    "Apple",
    "covid"
];
const blacklists = {
    blacklistPersonNames: blacklistPersonNames,
    blacklistOrganizationNames: blacklistOrganizationNames,
    blacklistPersonEmails: blacklistPersonEmails
};
const blacklists_txt = JSON.stringify(blacklists);
fs_1.writeFileSync(path_1.join(__dirname, "blacklist.json"), blacklists_txt);
//# sourceMappingURL=blacklist.js.map