import {app} from "./FirebaseConfig";
import {getAuth} from "firebase/auth"


export const auth = getAuth(app);
