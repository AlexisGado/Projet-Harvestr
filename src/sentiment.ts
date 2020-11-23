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
})

const comprehend = new AWS.Comprehend();

const rawData = readFileSync(join(__dirname, "data-anonymized.json")); //hardcode, data-to-anonymize
const rawMessages: Message[] = JSON.parse(rawData.toString());

const completeData=[]
for (const message of rawMessages){
  const params = {
    LanguageCode: "fr", /* required */
    Text: message.content /* required */
  };
  let messageWithSentiment = cloneDeep(message);
  comprehend.detectSentiment(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else{
      messageWithSentiment["sentiment"]=data; 
      completeData.push(messageWithSentiment);
    } 
  }); 
}  
console.log(completeData); //Problème de synchro, il affiche []

const dataWithSentiment = JSON.stringify(completeData);
writeFileSync(join(__dirname, "data-with-sentiment.json"), dataWithSentiment);