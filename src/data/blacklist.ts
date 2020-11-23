import {writeFileSync} from "fs";
import {join} from "path";

const blacklistPersonNames: string[] = [
    "Elon Musk",
    "Jean Dujardin",
    "Steve Jobs"
];
const blacklistPersonEmails: string[] = [
    "elon.musk@tesla.com",
    "jean.dujardin@oss.fr",
    "steve.jobs@rip.com"
];
const blacklistOrganizationNames: string[] = [
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
writeFileSync(join(__dirname, "blacklist.json"), blacklists_txt);