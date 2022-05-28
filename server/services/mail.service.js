import { setApiKey, send as sendEmail } from "@sendgrid/mail";

export class MailService {

    sendEmail(mailOptions) {
        return new Promise((resolve, reject) => {
            // set SENDGRID api key
            setApiKey(process.env.SENDGRID_API_KEY)

            // sending email request
            sendEmail(mailOptions)
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        });
    }
}

export default new MailService();