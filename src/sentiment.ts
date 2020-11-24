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

const completeData = cloneDeep(rawMessages);

type SentimentRequestType = {
    LanguageCode: string /* required */;
    TextList: Array<string> /* required */;
};

// const params: SentimentRequestType = {
//     LanguageCode: "fr" /* required */,
//     TextList: rawMessages.map(m => m.content)
// };

const detectSentiment = async (
    params: SentimentRequestType
): Promise<Message[]> => {
    return new Promise((resolve, reject) => {
        comprehend.batchDetectSentiment(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let i = 0; i < rawMessages.length; i++) {
                    completeData[i]["sentiment"] = data["ResultList"][i];
                }

                resolve(completeData);
            }
        });
    });
};

const main = async () => {
    const sentimentMessages = await detectSentiment({
        LanguageCode: "fr",
        TextList: rawMessages.map(m => m.content)
    });

    console.log(sentimentMessages);

    writeFileSync(
        join(__dirname, "data-with-sentiment.json"),
        JSON.stringify(sentimentMessages)
    );
};

main();
