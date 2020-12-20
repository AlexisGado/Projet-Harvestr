import {
    BatchDetectSentimentItemResult,
    ListOfDetectSentimentResult
} from "aws-sdk/clients/comprehend";
import { SentimentLabel, SentimentScore } from "aws-sdk/clients/lexruntime";

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
    sentiment?: BatchDetectSentimentItemResult;
    content?: string; // WARNING: this is html data
    sub_messages?: SubMessage[];
}

export type MessageComponents = Message | Person | SubMessage | Organization;

export interface Matching {
    blacklist: string;
    anonym: string;
}
