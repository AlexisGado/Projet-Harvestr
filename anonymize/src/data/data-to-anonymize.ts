
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



let M1:Message = {id:"msg1", requester:{id:"req1",name:"Elon Musk",email:"elon.musk@tesla.com"},submitter:{id:"submit1",name:"jean dujardin",email:"jean.dujardin@oss.fr"} }
let M2:Message = {id:"msg2", requester:{id:"req2",name:"Steve Jobs",email:"steve.jobs@rip.com"},submitter:{id:"submit2",name:"jean dujardin",email:"jean.dujardin@oss.fr"} }

export const dataToAnonymize: Message[] = [M1,M2];
