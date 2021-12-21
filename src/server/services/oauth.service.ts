import { drive_v3, google } from 'googleapis';

class GoogleOAuthService {

    redirectURL = "";
    response;
    private SCOPES = [
        'https://www.googleapis.com/auth/drive'
    ];

    getDriveClient() {
        return this.createDriveClient(
            process.env.GOOGLE_DRIVE_CLIENT_ID,
            process.env.GOOGLE_DRIVE_CLIENT_SECRET,
            process.env.GOOGLE_DRIVE_REDIRECT_URI
        )
    }

    private createDriveClient(clientId: string, clientSecret: string, redirectUri: string) {
        const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
            prompt: 'consent'
        });
        this.redirectURL = url;
        

        // const rl = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // });

        // rl.question('Authorization code: ', (code) => {
        //     console.log("CODE", code);
        //     oAuth2Client.getToken(code, (err, tokens) => {
        //         oAuth2Client.setCredentials(tokens);
        //         rl.close();
        //     });
        // });
        oAuth2Client.setCredentials({ refresh_token: '1//04YgMfVJ0C8a2CgYIARAAGAQSNwF-L9IrsI24_C7nuf5To_iv6oR4IEsxHtg7akKHmT_i6j0oxHXwmgnwBsyG3mJsJMfvwnDYmYc' });
        
        return google.drive({
            version: 'v3',
            auth: oAuth2Client,
        });
    }

}

export const googleOAuthService = new GoogleOAuthService();