import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import { app, auth } from "../../firebase"
import { USER_FOLLOWING_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants";

export function fetchUser() {
    return (async (dispatch) => {
        const db = getFirestore(app);
        const docRef = doc(db, "users", auth.currentUser.uid)
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
        const docRef = doc(db, "posts", auth.currentUser.uid)
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

export function fetchUserFollowing() {
    return ((dispatch) => {
        const db = getFirestore(app)
        const followRef = doc(db, "following", auth.currentUser.uid)
        const userFollowRef = collection(followRef, "userFollowing")

        onSnapshot(userFollowRef, (snapshot) => {
            const following = []
            snapshot.forEach((doc) => {
                const id = doc.id;
                following.push(id)
            })
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
        })
    })
}