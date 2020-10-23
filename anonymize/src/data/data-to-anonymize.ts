
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

export const dataToAnonymize: Message[] = [ {id:"cc", requester:{id:"yo",name:"Elon Musk",email:"elon Musk"},submitter:{id:"yo",name:"Zizou",email:"popo"} }];
