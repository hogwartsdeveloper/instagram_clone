import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import { app, auth } from "../../firebase"
import { USER_FOLLOWING_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants";

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
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
            for(let i = 0; i < following.length; i++) {
                dispatch(fetchUsersData(following[i]));
            }
        })
    })
}

export function fetchUsersData(uid) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if (!found) {
            const db = getFirestore(app);
            const docRef = doc(db, "users", uid)
            onSnapshot(docRef, (snapshot) => {
                if(snapshot.exists) {
                    const data = snapshot.data();
                    const uid = snapshot.id;
                    let user = {...data, uid}

                    dispatch({type: USERS_DATA_STATE_CHANGE, user})
                    dispatch(fetchUsersFollowingPosts(user.uid))
                } else {
                    console.log('does not exist');
                }
            })            
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        const db = getFirestore(app);
        const docRef = doc(db, "posts", uid)
        const colRef = collection(docRef, "userPosts")
        const q = query(colRef, orderBy("creation", "asc"))

        onSnapshot(q, (snapshot) => {
            if (snapshot.docs.length > 0) {
                var uid = snapshot.docs[0].ref.path.split('/')[1];
            }
            const user = getState().usersState.users.find(el => el.uid === uid)
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data, user}
            })

            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
        })
    })
}