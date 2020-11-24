import AWS from "aws-sdk";

import { writeFileSync, readFileSync } from "fs";
import { Message } from "./data/data-type";
import { join } from "path";
import { cloneDeep } from "lodash";
import { log } from "console";

AWS.config.update({
    apiVersion: "2017-11-27",
    accessKeyId: "AKIAS2KGGOLMF6VP7YDF",
    secretAccessKey: "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",
    region: "eu-west-2"
});

const comprehend = new AWS.Comprehend();

const rawData = readFileSync(join(__dirname, "data-anonymized.json"));
const rawMessages: Message[] = JSON.parse(rawData.toString());

type SentimentType = {
    LanguageCode: string /* required */;
    Text: string /* required */;
};

// const params: SentimentRequestType = {
//     LanguageCode: "fr" /* required */,
//     TextList: rawMessages.map(m => m.content)
// };

const detectSentiment = async (params: SentimentType) => {
    return new Promise((resolve, reject) => {
        comprehend.detectSentiment(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const completeData = [];

const main = async () => {
    for (const message of rawMessages) {
        let messageWithSentiment = cloneDeep(message);
        const sentimentMessage = await detectSentiment({
            LanguageCode: "fr",
            Text: message.content
        });
        messageWithSentiment["sentiment"] = sentimentMessage;
        completeData.push(messageWithSentiment);
    }

    console.log(completeData);

    writeFileSync(
        join(__dirname, "data-with-sentiment.json"),
        JSON.stringify(completeData)
    );
};

main();
