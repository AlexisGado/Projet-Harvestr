const backlistPersonNames: string[] = [ "Elon Musk", "Jean Dujardin", "Steve Jobs", "Zizou"];
const backlistPersonEmails: string[] = [ "elon.musk@tesla.com", "jean.dujardin@oss.fr", "steve.jobs@rip.com" ];;
const backlistCompanyNames: string[] = [ "Paypal", "Hollywood", "Apple" ];

// Please note: tripledots used below is called spread operator in javascript, it acts as an array concatenation in the example below
export const blackListElements: string[] = [ ...backlistPersonNames, ...backlistPersonEmails , ...backlistCompanyNames ]