import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { app, auth } from "../../firebase"
import { USER_STATE_CHANGE } from "../constants";

export function fetchUser() {
    return (async (dispatch) => {
        const db = getFirestore(app);
        const docRef = doc(db, "users", getAuth(app).currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists) {
            dispatch({type: USER_STATE_CHANGE, currentUser: docSnap.data()})
        } else {
            console.log('does not exist');
        }
    })
}