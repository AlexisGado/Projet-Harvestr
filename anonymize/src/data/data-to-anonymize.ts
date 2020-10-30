import { Interface } from "readline";
import { MessageChannel } from "worker_threads";

interface Organization {
    id: string;
    name: string;
}

interface Person {
    id: string;
    name: string;
    email: string;
    organization?: Organization;
}

interface SubMessage {
    id: string;
    submitter: Person;
    content: string; // WARNING: this is html data
}

interface Message {
    id: string;
    requester: Person;
    submitter: Person;
    clientId?: string;
    title?: string;
    content?: string; // WARNING: this is html data
    sub_messages?: SubMessage[];
}

let CompanyReq1={id : "company1", name : "Tesla"}
let CompanySub1={id : "company1", name : "Hollywood"}
let Requester1={id:"req1",name:"Elon Musk",email:"elon.musk@tesla.com", organization : CompanyReq1};
let Submitter1={id:"submit1",name:"jean dujardin",email:"jean.dujardin@oss.fr", organization : CompanySub1};

let Requester2={id:"req2",name:"Steve Jobs",email:"steve.jobs@rip.com"};
let Submitter2={id:"submit2",name:"jean dujardin",email:"jean.dujardin@oss.fr"};

let Requester3={id:"req3",name:"Didier Raoult",email:"didier.raoult@latimone.fr"};
let Submitter3={id:"submit3",name:"manu macron",email:"emmanuel.macron@elysee.fr"};

let M1:Message = {id:"msg1", requester:Requester1 ,submitter:Submitter1, title : "Paypal paying", content : "I'm sad that paypal not pay" }
let M2:Message = {id:"msg2", requester:Requester2,submitter:Submitter2, title : "Apple film", content : "I want to play in an apple film" }
let M3:Message = {id:"msg3", requester:Requester3,submitter:Submitter3, title : "Covid-19", content : "covid is just a little flue"}

export const dataToAnonymize: Message[] = [M1,M2,M3];

export {Message,Person,Organization,SubMessage};
