import AWS from "aws-sdk";
import { writeFileSync, readFileSync } from "fs";
import { Message } from "./data/data-type";
import { join } from "path";
import { cloneDeep } from "lodash";

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
const params = {
    LanguageCode: "fr" /* required */,
    TextList: [] /* required */
};
for (const message of rawMessages) {
    params["TextList"].push(message.content);
}
comprehend.batchDetectSentiment(params, (err, data) => {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
        for (let i = 0; i < rawMessages.length; i++) {
            completeData[i]["sentiment"] = {
                sentiment: data["ResultList"][i]["Sentiment"],
                sentimentScore: data["ResultList"][i]["SentimentScore"]
            };
        }
        console.log(completeData);
        const dataWithSentiment = JSON.stringify(completeData);
        writeFileSync(
            join(__dirname, "data-with-sentiment.json"),
            dataWithSentiment
        );
    }
});
