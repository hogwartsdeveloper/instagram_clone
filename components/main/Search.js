import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useState } from "react"
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native"
import { app } from "../../firebase"

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = async (search) => {
        const db = getFirestore(app);
        const docRef = collection(db, "users");
        const q = query(docRef, where('name', '>=', search))
        const querySnapshot = await getDocs(q);
        const user = []
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id;
            user.push({id, ...data})
        })
        setUsers(user);
        console.log(users);
    }
    return (
        <View>
            <TextInput
                placeholder="Type Here..." 
                onChangeText={(search) => fetchUsers(search)} 
            />
            <FlatList 
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}