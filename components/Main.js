import React, { Component } from 'react';
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser, fetchUserPosts } from '../redux/actions';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import FeedScreen from './main/Feed';
import  MaterialCommunityIcons  from "react-native-vector-icons/MaterialCommunityIcons"
import ProfileScreen from './main/Profile';

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName='Feed' labeled={false}>
                <Tab.Screen 
                    name="Feed" 
                    component={FeedScreen} 
                    options={{
                        tabBarIcon: ({ color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen 
                    name="AddContainer" 
                    component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size}) => (
                            <MaterialCommunityIcons name='plus-box' color={color} size={26} />
                        )
                    }}
                />
                <Tab.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{
                        tabBarIcon: ({ color, size}) => (
                            <MaterialCommunityIcons name='account-circle' color={color} size={26} />
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);
