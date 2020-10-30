"use strict";
var faker = require("faker/locale/en");
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var csvWriter = createCsvWriter({
    path: 'anon-data.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'mail', title: 'Mail' },
        { id: 'organization', title: 'Organization' },
    ]
});
function genere_mail(name) {
    var mail_part1 = name.replace(/\s/g, ".");
    mail_part1 = mail_part1.toLowerCase();
    var mail_part2 = faker.internet.email();
    var tab = mail_part2.split("@");
    mail_part2 = tab.pop();
    var mail = mail_part1.concat("@", mail_part2);
    return mail;
}
var data = [];
var data_size = 10;
for (var i = 0; i < data_size; i++) {
    var rand_name = faker.name.findName();
    data.push({
        name: rand_name,
        mail: genere_mail(rand_name),
        organization: faker.company.companyName()
    });
}
console.log("Anonym data", data);
csvWriter
    .writeRecords(data)
    .then(function () { return console.log('The CSV file was written successfully'); });
