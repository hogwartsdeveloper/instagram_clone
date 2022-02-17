import { Component } from "react";
import { Button, TextInput, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase";

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onSignIn = this.onSignIn.bind(this)
    }

    onSignIn() {
        const { email, password} = this.state;
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => console.log(result))
            .catch((error) => console.log(error))
    }

    render() {
        return (
            <View>
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
                    onPress={() => this.onSignIn()}
                    title="Sign In"
                />
            </View>
        )
    }
}

export default Login