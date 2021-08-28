import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';

import AuthLoadingScreen from '@screens/AuthLoading';
import MapViewScreen from '@screens/MapView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from '@api/authApi';
import SignInScreen from '@screens/Signin';
import SignUpScreen from '@screens/Signup';
import SignUpWithMapScreen from '@screens/SignUpWithMap';
import IntermediateSignUpScreen from '@screens/IntermediateSignUp';
import VerifyEmailScreen from '@screens/VerifyEmail';
import DashboardScreen from '@screens/Dashboard';
import MemberListScreen from '@screens/MemberList';
import UserProfileScreen from '@screens/UserProfile';
import SettingsHeader from '@components/settings-header/SettingsHeader';
import NewsDisplayScreen from '@screens/NewsDisplay';
import MemberProfileScreen from '@screens/MemberProfile';

const MainStack = createNativeStackNavigator();
const MainTabStack = createBottomTabNavigator();
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
        <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </AuthStack.Navigator>
);

const DashboardNavigator = () => (
    <DashboardStack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false}}>
        <DashboardStack.Screen name="Dashboard" component={DashboardScreen}/>
        <DashboardStack.Screen name="NewsDisplay" component={NewsDisplayScreen}/>
    </DashboardStack.Navigator>
);

const MemberListNavigator = () => (
    <MemberStack.Navigator initialRouteName="MemberList" screenOptions={{headerShown: false}}>
        <MemberStack.Screen name="MemberList" component={MemberListScreen}/>
        <MemberStack.Screen name="MemberProfile" component={MemberProfileScreen}/>
    </MemberStack.Navigator>
);

const UserProfileNavigator = () => (
    <ProfileStack.Navigator initialRouteName="UserProfile" screenOptions={{headerShown: false}}>
        <ProfileStack.Screen name="UserProfile" component={UserProfileScreen}/>
    </ProfileStack.Navigator>
);

const MainTabNavigator = () => (
    <MainTabStack.Navigator initialRouteName="DashboardNavigator" >
        <MainTabStack.Screen 
        name="DashboardNavigator" 
        component={DashboardNavigator}
        options={{
            title: 'Dashboard',
            tabBarIcon: () => <Icon name="grid" size={24}/>,
            headerShown: false
        }}    
        />
        <MainTabStack.Screen 
        name="MemberListNavigator" 
        component={MemberListNavigator}
        options={{
            title: 'Members',
            tabBarIcon: () => <Icon name="people" size={24}/>,
            headerShown: false
        }} 
        />
        <MainTabStack.Screen 
        name="UserProfileNavigator" 
        component={UserProfileNavigator}
        options={{
            title: 'Manage Profile',
            tabBarIcon: () => <Icon name="settings" size={24}/>,
            header: (props) => (
                <SettingsHeader {...props}/>
            ),
            headerStyle: {height: 100},
            headerMode: 'screen'
        }} 
        />
    </MainTabStack.Navigator>
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
            // await AsyncStorage.removeItem('authToken');
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
               <MainTabNavigator />
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
        <MainStack.Screen name="Tabs" component={MainTabNavigator} />
    </MainStack.Navigator>
);

export default AppContainer;