import {
    dataToAnonymize,
    Message,
    Person,
    Organization,
    SubMessage
} from "./data/data-to-anonymize";
import {
    blacklistPersonNames,
    blacklistPersonEmails,
    blacklistOrganizationNames
} from "./data/blacklist";
import csvParser from "csv-parser";

import { cloneDeep } from "lodash";

//Open files .csv containing our data (Name, emails Organization Name,  )
import { createReadStream } from "fs";
import { join } from "path";
const AnononymAttribute: any[] = [];

const myPath = join(__dirname, "../anon-data.csv");
const csvStream = createReadStream(myPath).pipe(csvParser());
csvStream.on("data", (data: string) => {
    AnononymAttribute.push(data);
    // read anonymized attribute data
});

csvStream.on("end", () => {
    onDataReadFinished();
});

type MessageComponents = Message | Person | SubMessage | Organization;

interface ReplacementSlot {
    blacklist: string[];
    anonym: string[];
}

interface Replacement {
    name: ReplacementSlot;
    email: ReplacementSlot;
    organization: ReplacementSlot;
}

const onDataReadFinished = () => {
    const AnonymizedPersonNames: string[] = [];
    const AnonymizedPersonEmails: string[] = [];
    const AnonymizedOrganizationNames: string[] = [];

    //Split anonymized attribute data in three categories: name, email, organization
    for (const objet of AnononymAttribute) {
        AnonymizedPersonNames.push(objet.Name);
        AnonymizedPersonEmails.push(objet.Mail);
        AnonymizedOrganizationNames.push(objet.Organization);
    }

    //Give the word we want to replace and the word we want to put instead
    const replacement: Replacement = {
        name: {
            blacklist: blacklistPersonNames,
            anonym: AnonymizedPersonNames
        },
        email: {
            blacklist: blacklistPersonEmails,
            anonym: AnonymizedPersonEmails
        },
        organization: {
            blacklist: blacklistOrganizationNames,
            anonym: AnonymizedOrganizationNames
        }
    };

    /*console.log("Blacklist Names",blacklistPersonNames);
    console.log("Blacklist Emails", blacklistPersonEmails);
    console.log("Blacklist Companies", blacklistOrganizationNames);
    console.log("Anonym Names",AnonymizedPersonNames); 
    console.log("Anonym Emails", AnonymizedPersonEmails); 
    console.log("Anonym Organization", AnonymizedOrganizationNames); */

    //recursive function which permit to explore all the message properties
    //and change them if some words are blacklisted
    const go_through = (
        object: MessageComponents,
        blacklist_elt: RegExp,
        anon_elt: string
    ) => {
        for (const key in object) {
            const k = key as keyof (
                | Message
                | Person
                | SubMessage
                | Organization
            );
            //if the attribute is a string, we are looking for blacklist-elt and possibly replace it
            if (typeof object[k] === "string") {
                (object[k] as string) = (object[k] as string).replace(
                    blacklist_elt,
                    anon_elt
                );
            }
            //else, we apply the function on the attribute
            else {
                (object[k] as any) = go_through(
                    object[k] as any,
                    blacklist_elt,
                    anon_elt
                );
                //no solution was found to avoid "as any"
            }
        }
        return object;
    };
    //for a given message, go through blacklist
    const go_through_blacklist = (
        message: Message,
        blacklist: string[],
        anonAttribute: string[]
    ) => {
        for (const blacklist_elt of blacklist) {
            const reg = new RegExp(blacklist_elt, "gi");
            const rd = Math.floor(Math.random() * anonAttribute.length);
            message = go_through(message, reg, anonAttribute[rd]) as Message;
        }
        return message;
    };
    //The list of anonymized message
    const dataAnonymized: Message[] = [];

    //
    for (const message of dataToAnonymize) {
        let message_anonymized: Message = cloneDeep(message);
        for (const key in replacement) {
            const k = key as keyof Replacement;
            message_anonymized = go_through_blacklist(
                message_anonymized,
                replacement[k].blacklist,
                replacement[k].anonym
            );
        }
        dataAnonymized.push(message_anonymized);
    }

    //displays the anonymized messages
    console.log("The data to anonymize : ", dataToAnonymize);
    console.log("The anonymized data : ", dataAnonymized);
    console.log(
        "Zoom on an organization : ",
        dataAnonymized[0].submitter.organization!
    );
    console.log("Zoom on submessages : ", dataAnonymized[0].sub_messages!);
};
