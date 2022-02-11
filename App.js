import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { Component } from "react";
import { Text, View } from "react-native";
import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/Login";
import RegisterScreen from "./components/auth/Register";
import MainScreen from "./components/Main";
import AddScreen from './components/main/Add';
import { auth } from "./firebase";
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import rootReducer from "./redux/reducers"
import thunk from "redux-thunk";
import SaveScreen from "./components/main/Save";

const store = createStore(rootReducer, applyMiddleware(thunk))

const Stack = createNativeStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}}/>
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App