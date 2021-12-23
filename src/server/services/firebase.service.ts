import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "../configs/firebase.config";

class FirebaseService {

    private app: FirebaseApp;
    private analytics: Analytics;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.analytics = getAnalytics(this.app)
    }


}

export const firebaseService = new FirebaseService();