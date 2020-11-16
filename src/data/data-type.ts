export interface Organization {
    id: string;
    name: string;
}

export interface Person {
    id: string;
    name: string;
    email: string;
    organization?: Organization;
}

export interface SubMessage {
    id: string;
    submitter: Person;
    content: string; // WARNING: this is html data
}

export interface Message {
    id: string;
    requester: Person;
    submitter: Person;
    clientId?: string;
    title?: string;
    content?: string; // WARNING: this is html data
    sub_messages?: SubMessage[];
}

export type MessageComponents = Message | Person | SubMessage | Organization;

export interface ReplacementSlot {
    blacklist: string[];
    anonym: string[];
}

export interface Replacement {
    name: ReplacementSlot;
    email: ReplacementSlot;
    organization: ReplacementSlot;
}