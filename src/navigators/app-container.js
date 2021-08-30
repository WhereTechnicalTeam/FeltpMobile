import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Wander } from 'react-native-animated-spinkit'

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
import ChangePasswordScreen from '@screens/ChangePassword';
import SettingsScreen from '@screens/Settings';
import JobHistoryScreen from '@screens/JobHistory';
import NotificationsListScreen from '@screens/NotificationsList';
import EditProfileScreen from '@screens/EditProfile';
import EditProfile2Screen from '@screens/EditProfile2';
import EditProfile3Screen from '@screens/EditProfile3';
import { colors } from '@theme/colors';

const MainTabStack = createBottomTabNavigator();
const ManageUserTabStack = createMaterialTopTabNavigator();
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const MemberStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const JobStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const NotificationStack = createNativeStackNavigator();

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
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
        <ProfileStack.Screen name="EditProfile2" component={EditProfile2Screen} />
        <ProfileStack.Screen name="EditProfile3" component={EditProfile3Screen} />
    </ProfileStack.Navigator>
);

const SettingsNavigator = () => (
    <SettingsStack.Navigator initialRouteName="Settings" screenOptions={{headerShown: false}}>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} />
        <SettingsStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </SettingsStack.Navigator>
);

const JobNavigator = () => (
    <JobStack.Navigator initialRouteName="JobHistory" screenOptions={{headerShown: false}}>
        <JobStack.Screen name="JobHistory" component={JobHistoryScreen}/>
    </JobStack.Navigator>
);

const NotificationNavigator = () => (
    <NotificationStack.Navigator initialRouteName="Notifications" screenOptions={{headerShown: false}}>
        <NotificationStack.Screen name="Notifications" component={NotificationsListScreen}/>
    </NotificationStack.Navigator>
)

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
        name="ManageUser" 
        component={ManageUserNavigator}
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
);

const ManageUserNavigator = () => (
    <ManageUserTabStack.Navigator initialRouteName="UserProfileNavigator">
        <ManageUserTabStack.Screen name="UserProfileNavigator" component={UserProfileNavigator} options={{ title: 'Profile' }}/>
        <ManageUserTabStack.Screen name="JobNavigator" component={JobNavigator} options={{ title: 'Job History' }}/>
        <ManageUserTabStack.Screen name="NotificationNavigator" component={NotificationNavigator} options={{ title: 'Notifications' }}/>
    </ManageUserTabStack.Navigator>
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
    try {
        (async() => {
            setLoading(true);
            // await AsyncStorage.removeItem('authToken');
            // await AsyncStorage.removeItem('userDetails');

            const token = await AsyncStorage.getItem('authToken');            
            const response = await validateToken(token);
            setLoading(false);
            if(response.status == 200) {
                setIsAuthenticated(true);
            } 
        })();
    } catch(error) {
        console.error("Error loading app:", error);
    }
    }, []);

    return (
               loading ? 
               <View style={{backgroundColor: colors.primary, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                   <Wander color={colors.white}/>
               </View>
                :
               (
                   isAuthenticated ? 
               <MainTabNavigator />
               :
                <AuthLoadingScreen 
                    onCreateAccountPress={navigateSignup} 
                    onRedirectTextPress={navigateSignin}
                    appName="FELTP ALUMNI"
                    subTitle="Connect with your peers anywhere"
               />
               )
    );
}

const AppContainer = () => (
    <MainStack.Navigator initialRouteName="Auth" screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Auth" component={AuthNavigator}/>
        <MainStack.Screen name="Tabs" component={MainTabNavigator} />
        <MainStack.Screen name="SettingsNavigator" component={SettingsNavigator} />
    </MainStack.Navigator>
);

export default AppContainer;

export {DashboardNavigator, MemberListNavigator};