import AWS from "aws-sdk";


const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27',region:"eu-west-2"});
const params = {
    LanguageCode: "fr", /* required */
    Text: 'rxcfygvhbjncgvhb' /* required */
  };
comprehend.detectSentiment(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});