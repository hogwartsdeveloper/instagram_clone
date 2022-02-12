import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet } from 'react-native';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, } from "firebase/firestore"
import { connect } from 'react-redux';
import { auth, app } from '../../firebase';

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect( async() => {
    const { currentUser, posts } = props;
    console.log({currentUser, posts});

    if(props.route.params.uid === auth.currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      const db = getFirestore(app);
      const docRef = doc(db, "users", props.route.params.uid)
      const userSnap = await getDoc(docRef)
      if (userSnap.exists) {
          setUser(userSnap.data());
      } else {
          console.log('does not exist');
      }

      const postRef = doc(db, "posts", props.route.params.uid)
      const postColRef = collection(postRef, "userPosts")
      const q = query(postColRef, orderBy("creation", "asc"))

      const querySnapshot = await getDocs(q);
      const posts = []
      querySnapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id;
          posts.push({id, ...data})
      })
      setUserPosts(posts);
    }
    console.log(user, userPosts);
  }, [props.route.params.uid])

  if(user === null) {
    return <View />
  }

  return (
      <View style={styles.container}>
        <View style={styles.containerInfo}>
          <Text>{ user.name }</Text>
          <Text>{ user.email }</Text>
        </View>
        <View style={styles.containerGallery}>
          <FlatList 
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({item}) => (
              <View style={styles.containerImage}>
                <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                />
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
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);