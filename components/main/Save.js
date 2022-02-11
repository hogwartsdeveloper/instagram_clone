import React, { useState } from 'react'
import { Button, Image, TextInput, View } from 'react-native'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { doc, getFirestore, serverTimestamp, setDoc, collection } from 'firebase/firestore';

export default function Save(props) {
    const [caption, setCaption] = useState('');

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `posts/${getAuth(app).currentUser.uid}/${Math.random().toString(36)}`
        const response = await fetch(uri);
        const blob = await response.blob();

        const storage = getStorage();
        const montainsRef = ref(storage, childPath);

        const uploadTask = uploadBytesResumable(montainsRef, blob)


        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`);
        }

        const taskError = snapshot => {
            console.log(snapshot);
        }

        const taskCompleted = () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    savePostData(downloadURL)
                })
        }

        uploadTask.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        const db = getFirestore(app);
        const fireDoc = doc(db, "posts", getAuth(app).currentUser.uid)
        const colRef = doc(collection(fireDoc, "userPosts"))
        setDoc(colRef, {
            downloadURL,
            caption,
            creation: serverTimestamp()
        })
            .then((function () {
                props.navigation.popToTop()
            }))
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}} />
            <TextInput 
                placeholder='Write a Caption ...'
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title='Save' onPress={() => uploadImage()}/>
        </View>
    )
}
