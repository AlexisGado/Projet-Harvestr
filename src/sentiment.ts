import AWS from "aws-sdk";

AWS.config.update({
  apiVersion: "2017-11-27",
  accessKeyId: "AKIAS2KGGOLMF6VP7YDF",
  secretAccessKey: "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",
  region: "eu-west-2"
})

const comprehend = new AWS.Comprehend();
const params = {
    LanguageCode: "fr", /* required */
    Text: 'sentiments mitigés' /* required */
  };
comprehend.detectSentiment(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});