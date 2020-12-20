import { writeFileSync, readFileSync } from "fs";
import { Message, Matching, MessageComponents } from "./data/data-type";
import { join } from "path";
import { cloneDeep } from "lodash";

const rawData = readFileSync(join(__dirname, "data", process.argv[2])); // data-to-anonymize
const dataToAnonymize: Message[] = JSON.parse(rawData.toString());

const rawMatching = readFileSync(join(__dirname, "data", process.argv[3])); // Matching
const matching: Matching[] = JSON.parse(rawMatching.toString());

//recursive function which permit to explore all the message properties
//and change them if some words are blacklisted
const go_through = (
    object: MessageComponents,
    blacklist_elt: RegExp,
    anon_elt: string
) => {
    for (const key in object) {
        const k = key as keyof MessageComponents;
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
const go_through_blacklist = (message: Message) => {
    for (const match of matching) {
        const reg = new RegExp(match.blacklist, "gi");
        message = go_through(message, reg, match.anonym) as Message;
    }
    return message;
};
//The list of anonymized message
const dataAnonymized: Message[] = [];

for (const message of dataToAnonymize) {
    let message_anonymized: Message = cloneDeep(message);
    message_anonymized = go_through_blacklist(message_anonymized);
    dataAnonymized.push(message_anonymized);
}

//displays the anonymized messages
console.log("The data to anonymize : ", dataToAnonymize);
console.log("The anonymized data : ", dataAnonymized);
const data = JSON.stringify(dataAnonymized);
writeFileSync(join(__dirname, "data-anonymized.json"), data);
