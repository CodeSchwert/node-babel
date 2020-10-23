import AWS from 'aws-sdk';

const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET;
const FROM = process.env.FROM;
const REGION = process.env.REGION;

/**
 * @name sendEmail
 * @description Send email via AWS SES.
 * @param {String[]} to - Array of recieving email address.
 * @param {String} sub - Email subject.
 * @param {String} msg - Email message body.
 * @param {String} from - Email FROM address.
 */
const sendEmail = async (to, sub, msg, from=FROM) => {
  try {
    const creds = new AWS.Credentials({
      accessKeyId: ACCESS_KEY, 
      secretAccessKey: SECRET
    });
    AWS.config.credentials = creds;
    AWS.config.update({ region: REGION });
    const ses = new AWS.SES();
  
    // Create sendEmail params 
    const params = {
      Destination: {
        CcAddresses: [ from ],
        ToAddresses: to
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
          Charset: "UTF-8",
          Data: msg
          },
          Text: {
          Charset: "UTF-8",
          Data: msg
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: sub
        }
        },
      Source: from, /* required */
    };
  
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    
    return result;
  } catch (e) {
    console.error(e);
  }
};

export default sendEmail;
