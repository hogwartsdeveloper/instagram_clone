import { deleteDoc, setDoc, getFirestore, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet, Button} from 'react-native';
import { connect } from 'react-redux';
import { app, auth } from '../../firebase';

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if(props.usersFollowingLoaded === props.following.length && props.following.length !== 0) {
      props.feed.sort(function(x, y){
        return x.creation - y.creation;
      })
      setPosts(props.feed);
    }
    console.log(posts);
  }, [props.usersFollowingLoaded, props.feed])

  const onLikePress = (userId, postId) => {
    const db = getFirestore(app);
    const postRef = doc(db, "posts", userId)
    const userPostRef = doc(postRef, "userPosts", postId)
    const likesRef = doc(userPostRef, "likes", auth.currentUser.uid)
    setDoc(likesRef, {})
  }

  const onDislikePress = (userId, postId) => {
    const db = getFirestore(app);
    const postRef = doc(db, "posts", userId)
    const userPostRef = doc(postRef, "userPosts", postId)
    const likesRef = doc(userPostRef, "likes", auth.currentUser.uid)
    deleteDoc(likesRef)
  }

  return (
      <View style={styles.container}>
        <View style={styles.containerGallery}>
          <FlatList 
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({item}) => (
              <View style={styles.containerImage}>
                <Text style={styles.container}>{item.user.name}</Text>
                <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                />
                { item.currentUser ? 
                  (
                    <Button 
                      title='Dislike'
                      onPress={() => onDislikePress(item.user.uid, item.id)}
                    />
                  )
                :
                  (
                    <Button 
                      title='Like'
                      onPress={() => onLikePress(item.user.uid, item.id)}
                    />
                  )
                }
                <Text
                  onPress={() => props.navigation.navigate("Comment",
                    {postId: item.id, uid: item.user.uid}
                  )}
                >
                  View Comments...
                </Text>
              </View>
            )}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20
  },
  containerGallery: {
    flex: 1
  },
  containerImage: {
    flex: 1/3
  },
  image: {
    flex: 1,
    aspectRatio: 1/1
  }
})


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);