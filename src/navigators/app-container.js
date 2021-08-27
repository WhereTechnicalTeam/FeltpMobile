import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import AuthLoadingScreen from '@screens/AuthLoading';
import MapViewScreen from '@screens/MapView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from '@api/authApi';
import SignInScreen from '@screens/Signin';
import SignUpScreen from '@screens/Signup';
import SignUpWithMapScreen from '@screens/SignUpWithMap';
import IntermediateSignUpScreen from '@screens/IntermediateSignUp';

const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const MemberStack = createNativeStackNavigator();
const ManageProfileStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const JobStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="AuthLoading" screenOptions={{headerShown: false}}>
        <AuthStack.Screen name="AuthLoading" component={AuthLoadingWrapper} />
        <AuthStack.Screen name="Signin" component={SignInScreen}/>
        <AuthStack.Screen name="Signup" component={SignUpScreen}/>
        <AuthStack.Screen name="IntermediateSignup" component={IntermediateSignUpScreen} />
        <AuthStack.Screen name="SignupWithMap" component={SignUpWithMapScreen} />
        <AuthStack.Screen name="MapView" component={MapViewScreen} />
    </AuthStack.Navigator>
)

const AuthLoadingWrapper = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigateSignup = () => {
        props.navigation.navigate('Signup');
    }

    const navigateSignin = () => {
        props.navigation.navigate('Signin');
    }

    useEffect(() => {
        setLoading(true);
        try {
        (async() => {
            //             await AsyncStorage.removeItem('authToken');
            // await AsyncStorage.removeItem('userDetails');

            const token = await AsyncStorage.getItem('authToken');            
            const response = await validateToken(token);
            if(response.status == 200) {
                setIsAuthenticated(true);
            } 
            SplashScreen.hide();
        })();
    } catch(error) {
        console.error("Error loading app:", error);
    }
        setLoading(false);
    });

    return (
        loading ? null :
        <View style={{flex: 1}}>
           {
               isAuthenticated ? 
               <MapViewScreen />
               :
               <AuthLoadingScreen 
                    onCreateAccountPress={navigateSignup} 
                    onRedirectTextPress={navigateSignin}
                    appName="FELTP ALUMNI"
                    subTitle="Connect with your peers anywhere"
               />
           }
        </View>            
    );
}

const AppContainer = () => (
    <MainStack.Navigator initialRouteName="Auth" screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Auth" component={AuthNavigator}/>
    </MainStack.Navigator>
);

export default AppContainer;