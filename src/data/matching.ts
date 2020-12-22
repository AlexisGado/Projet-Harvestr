import * as faker from "faker/locale/en";
import { join } from "path";
import { writeFileSync, readFileSync } from "fs";
import { Matching } from "./data-type";

const rawBlacklist = readFileSync(join(__dirname, process.argv[2])); // blacklist
const blacklist = JSON.parse(rawBlacklist.toString());

//given a name, return an matching email, but unuseful in our algorithm
function genere_mail(name: string) {
    const mail_part1 = name.replace(/\s/g, ".").toLowerCase();
    const mail_part2 = faker.internet.email().split("@").pop();
    const mail = mail_part1.concat("@", mail_part2);
    return mail;
}

const min_size = { PersonName: 3, OrganizationName: 2, PersonEmail: 5 };
const matching: Matching[] = [];

for (const blacklist_name of blacklist["blacklistPersonNames"]) {
    if (blacklist_name != null && blacklist_name.length > min_size.PersonName) {
        matching.push({
            blacklist: blacklist_name,
            anonym: faker.name.findName()
        });
    }
}
for (const blacklist_email of blacklist["blacklistPersonEmails"]) {
    if (
        blacklist_email != null &&
        blacklist_email.length > min_size.PersonEmail
    ) {
        matching.push({
            blacklist: blacklist_email,
            anonym: faker.internet.email()
        });
    }
}
for (const blacklist_organization of blacklist["blacklistOrganizationNames"]) {
    if (
        blacklist_organization != null &&
        blacklist_organization.length > min_size.OrganizationName
    ) {
        matching.push({
            blacklist: blacklist_organization,
            anonym: faker.company.companyName()
        });
    }
}

//console.log("Anonym data",data)

const matching_json = JSON.stringify(matching);
writeFileSync(join(__dirname, "matching.json"), matching_json);
