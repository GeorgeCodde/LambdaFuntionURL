import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const REGION = process.env.REGION;
const sesClient = new SESClient({ region: REGION });

const createSendEmailCommand = (toAddress: string, fromAddress: string) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "HTML_FORMAT_BODY desde HTML",
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY desde TEXT",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const sendEmail = async () => {
  const sendEmailCommand = createSendEmailCommand(
    process.env.EMAIL_TO!,
    process.env.EMAIL_FROM!,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e: any) {
    console.error("Failed to send email. Error message: ", e.message);
    return e;
  }
};