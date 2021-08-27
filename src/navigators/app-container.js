import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import AuthLoadingScreen from '@screens/AuthLoading';
import MapViewScreen from '@screens/MapView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from '@api/authApi';

const MainStack = createNativeStackNavigator();

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
        <MainStack.Screen name="Auth" component={AuthLoadingWrapper}/>
    </MainStack.Navigator>
);

export default AppContainer;