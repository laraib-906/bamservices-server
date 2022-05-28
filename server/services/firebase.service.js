import firebaseAdmin from 'firebase-admin';
import firebaseConfig from '../config/firebase.config.js';
import { v4 as uuidv4 } from "uuid";

class FirebaseService {

    admin;
    storageRef;

    constructor() {
        this.admin = firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: firebaseConfig.projectId,
                privateKey: firebaseConfig.privateKey,
                clientEmail: firebaseConfig.clientEmail,
            }),
            databaseURL: firebaseConfig.databaseUrl
        });
        this.storageRef = this.admin.storage().bucket(`gs://${firebaseConfig.bucket}`)
    }

    async uploadFile(file) {
        return await this.storageRef.upload(file.path, {
            public: true,
            destination: `secrets/${file.filename}`,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        })
    }

    async removeFile(filename) {
        return await this.storageRef.file(filename).delete();
    }

}

export default new FirebaseService();