const faker = require("faker/locale/en");

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'anon-data.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'mail', title: 'Mail'},
    {id: 'organization', title: 'Organization'},
  ]
});

//given a name, return an matching email, but unuseful in our algorithm
function genere_mail(name:string){
    let mail_part1=name.replace(/\s/g, ".");
    mail_part1=mail_part1.toLowerCase();
    let mail_part2=faker.internet.email();
    let tab =mail_part2.split("@")
    mail_part2=tab.pop();
    let mail=mail_part1.concat("@",mail_part2);
    return mail

}

const data=[];
//Number of false identity
const data_size=10;

//fill the csv file with anonyme attributes
for (var i=0;i<data_size;i++){
    data.push({
        name : faker.name.findName(), 
        mail : faker.internet.email(), 
        organization : faker.company.companyName()
    });
}

//console.log("Anonym data",data)


csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));