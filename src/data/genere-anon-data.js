var faker = require("faker/locale/en");
var createCsvWriter = require("csv-writer").createObjectCsvWriter;
var csvWriter = createCsvWriter({
    path: "anon-data.csv",
    header: [
        { id: "name", title: "Name" },
        { id: "mail", title: "Mail" },
        { id: "organization", title: "Organization" }
    ]
});
//given a name, return an matching email, but unuseful in our algorithm
function genere_mail(name) {
    var mail_part1 = name.replace(/\s/g, ".").toLowerCase();
    var mail_part2 = faker.internet.email().split("@").pop();
    var mail = mail_part1.concat("@", mail_part2);
    return mail;
}
var data = [];
//Number of false identity
var data_size = 10;
//fill the csv file with anonyme attributes
for (var i = 0; i < data_size; i++) {
    data.push({
        name: faker.name.findName(),
        mail: faker.internet.email(),
        organization: faker.company.companyName()
    });
}
//console.log("Anonym data",data)
csvWriter
    .writeRecords(data)
    .then(function () { return console.log("The CSV file was written successfully"); });
