import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import { app, auth } from "../../firebase"
import { 
    USER_FOLLOWING_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE, 
    USER_STATE_CHANGE, 
    USERS_DATA_STATE_CHANGE, 
    USERS_POSTS_STATE_CHANGE,
    CLEAR_DATA,
    USERS_LIKES_STATE_CHANGE
} from "../constants";

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

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
                dispatch(fetchUsersData(following[i], true));
            }
        })
    })
}

export function fetchUsersData(uid, getPosts) {
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
                } else {
                    console.log('does not exist');
                }
            })
            if (getPosts){
                dispatch(fetchUsersFollowingPosts(uid))
            } 
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

            for(let i = 0; i < posts.length; i++) {
                dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
            }

            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
        })
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch) => {
        const db = getFirestore(app);
        const postRef = doc(db, "posts", uid)
        const userPostRef = doc(postRef, "userPosts", postId)
        const likesRef = doc(userPostRef, "likes", auth.currentUser.uid)

        onSnapshot(likesRef, (snapshot) => {
            const postId = snapshot.ref.path.split('/')[3];
            console.log(postId);

            let currentUserLike = false;
            if(snapshot.exists) {
                currentUserLike = true;
            }

            dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
        })
    })
}