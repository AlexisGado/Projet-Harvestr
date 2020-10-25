const blacklistPersonNames: string[] = [ "Elon Musk", "Jean Dujardin", "Steve Jobs"];
const blacklistPersonEmails: string[] = [ "elon.musk@tesla.com", "jean.dujardin@oss.fr", "steve.jobs@rip.com" ];;
const blacklistCompanyNames: string[] = [ "Paypal", "Hollywood", "Apple" ];

// Please note: tripledots used below is called spread operator in javascript, it acts as an array concatenation in the example below
export const blackListElements: string[] = [ ...blacklistPersonNames, ...blacklistPersonEmails , ...blacklistCompanyNames ]