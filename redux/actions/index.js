import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore"
import { app, auth } from "../../firebase"
import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants";

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

export function fetchUserPosts() {
    return ( async (dispatch) => {
        const db = getFirestore(app);
        const docRef = doc(db, "posts", getAuth(app).currentUser.uid)
        const colRef = collection(docRef, "userPosts")
        const q = query(colRef, orderBy("creation", "asc"))

        const querySnapshot = await getDocs(q);
        const posts = []
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id;
            posts.push({id, ...data})
        })
        dispatch({type: USER_POSTS_STATE_CHANGE, posts: posts})
    })
}