const faker = require("faker");

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'anon-data.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'mail', title: 'Mail'},
    {id: 'company', title: 'Company'},
  ]
});


function genere_mail(name:string){
    let mail_part1=name.replace(/\s/g, ".");
    mail_part1=mail_part1.toLowerCase();
    let mail_part2=faker.internet.email();
    let tab =mail_part2.split("@")
    mail_part2=tab.pop();
    let mail=mail_part1.concat("@",mail_part2);
    return mail

}

const data=[]

for (var i=0;i<100;i++){
    let rand_name=faker.name.findName()  
    data.push({
        name : rand_name, 
        mail : genere_mail(rand_name), 
        company : faker.company.companyName()
    });
    console.log(data.length);
}




csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));