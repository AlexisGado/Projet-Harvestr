"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = __importStar(require("faker/locale/en"));
const path_1 = require("path");
const fs_1 = require("fs");
//given a name, return an matching email, but unuseful in our algorithm
function genere_mail(name) {
    const mail_part1 = name.replace(/\s/g, ".").toLowerCase();
    const mail_part2 = faker.internet.email().split("@").pop();
    const mail = mail_part1.concat("@", mail_part2);
    return mail;
}
const data = [];
//Number of false identity
const data_size = 10;
//fill the csv file with anonyme attributes
for (var i = 0; i < data_size; i++) {
    data.push({
        name: faker.name.findName(),
        mail: faker.internet.email(),
        organization: faker.company.companyName(),
    });
}
//console.log("Anonym data",data)
const anonData = JSON.stringify(data);
fs_1.writeFileSync(path_1.join(__dirname, "anon-data.json"), anonData);
//# sourceMappingURL=genere-anon-data.js.map