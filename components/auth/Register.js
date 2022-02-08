import { Component } from "react";
import { Button, TextInput, View } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase";

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name } = this.state;
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => console.log(result))
            .catch((error) => console.log(error))
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="password"
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry
                />

                <Button 
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register