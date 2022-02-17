import { collection, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import React, {useState, useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput } from "react-native"
import { app, auth } from '../../firebase'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {

        function matchUserToComment(comments) {
            for(let i = 0; i < comments.length; i++) {
                const user = props.users.find(x => x.uid === comments[i].creator);
                if(comments[i].hasOwnProperty('user')) {
                    continue;
                }
                if(user === undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if(props.route.params.postId !== postId) {
            const db = getFirestore(app)
            const postRef = doc(db, "posts", props.route.params.uid)
            const userPostRef = doc(postRef, "userPosts", props.route.params.postId)
            const commentsCol = collection(userPostRef, "comments")
            onSnapshot(commentsCol, (snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                matchUserToComment(comments)
            })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }

    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        const db = getFirestore(app)
        const postRef = doc(db, "posts", props.route.params.uid)
        const userPostRef = doc(postRef, "userPosts", props.route.params.postId)
        const commentsCol = collection(userPostRef, "comments")
        setDoc(doc(commentsCol), {
            creator: auth.currentUser.uid,
            text
        })
    }

    return (
        <View>
            <FlatList 
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined
                            ?   <Text>{item.user.name}</Text>
                            :   null
                        }
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <View>
                <TextInput 
                    placeholder='comment'
                    onChangeText={(text) => setText(text)}
                />
                <Button 
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>
        </View>
    )
}


const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment);