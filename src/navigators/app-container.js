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
import ChatListScreen from '@screens/ChatList';
import ChatScreen from '@screens/Chat';
import MemberMapScreen from '@screens/MemberMap';
import SelectChatScreen from '@screens/SelectChat';

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
const MemberMapStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="AuthLoading" screenOptions={{headerShown: false}}>
        <AuthStack.Screen name="AuthLoading" component={AuthLoadingWrapper} />
        <AuthStack.Screen name="Signin" component={SignInScreen}/>
        <AuthStack.Screen name="Signup" component={SignUpScreen}/>
        <AuthStack.Screen name="IntermediateSignup" component={IntermediateSignUpScreen} />
        <AuthStack.Screen name="SignupWithMap" component={SignUpWithMapScreen} />
        <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </AuthStack.Navigator>
);

const DashboardNavigator = () => (
    <DashboardStack.Navigator initialRouteName="Dashboard" >
        <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown: false}}/>
        <DashboardStack.Screen name="NewsDisplay" component={NewsDisplayScreen} options={{headerShown: false}}/>
        <DashboardStack.Screen name="ManageUser" component={ManageUserNavigator} options={{
            header: (props) => (
                <SettingsHeader {...props}/>
            ),
            headerStyle: {height: 100},
            headerMode: 'screen'
        }} />
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

const ChatNavigator = () => (
    <ChatStack.Navigator initialRouteName="ChatList" screenOptions={{headerShown: false}}>
        <ChatStack.Screen name="ChatList" component={ChatListScreen} />
        <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
        <ChatStack.Screen name="SelectChat" component={SelectChatScreen} />
    </ChatStack.Navigator>
);

const MemberMapNavigator = () => (
    <MemberMapStack.Navigator initialRouteName="MemberMap" screenOptions={{headerShown: false}}>
        <MemberMapStack.Screen name="MemberMapScreen" component={MemberMapScreen} />
    </MemberMapStack.Navigator>
)

const MainTabNavigator = () => (
    <MainTabStack.Navigator initialRouteName="DashboardNavigator" screenOptions={{
        tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondaryBlack,
    }}>
        <MainTabStack.Screen 
        name="DashboardNavigator" 
        component={DashboardNavigator}
        options={{
            title: 'Dashboard',
            tabBarIcon: ({focused}) => <Icon name="grid" size={24} color={focused ? colors.primary : colors.secondaryBlack}/>,
            headerShown: false
        }}    
        />
        <MainTabStack.Screen 
        name="MemberListNavigator" 
        component={MemberListNavigator}
        options={{
            title: 'Members',
            tabBarIcon: ({focused}) => <Icon name="people" size={24} color={focused ? colors.primary : colors.secondaryBlack}/>,
            headerShown: false
        }} />
        <MainTabStack.Screen 
        name="MemberMapNavigator" 
        component={MemberMapNavigator}
        options={{
            title: 'Map',
            tabBarIcon: ({focused}) => <Icon name="location" size={24} color={focused ? colors.primary : colors.secondaryBlack}/>,
            headerShown: false
        }} />
        <MainTabStack.Screen 
        name="ChatNavigator" 
        component={ChatNavigator}
        options={{
            title: 'Chat',
            tabBarIcon: ({focused}) => <Icon name="chatbubbles" size={24} color={focused ? colors.primary : colors.secondaryBlack}/>,
            headerShown: false
        }} />
    </MainTabStack.Navigator>
);

const ManageUserNavigator = () => (
    <ManageUserTabStack.Navigator initialRouteName="UserProfileNavigator" >
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
                    appName="GFELTP Connect"
                    subTitle="Connect with your peers anywhere"
               />
               )
    );
}

const AppContainer = () => (
    <MainStack.Navigator initialRouteName="Auth" >
        <MainStack.Screen name="Auth" component={AuthNavigator} options={{headerShown: false}}/>
        <MainStack.Screen name="Tabs" component={MainTabNavigator} options={{headerShown: false}}/>
        <MainStack.Screen name="SettingsNavigator" component={SettingsNavigator} options={{headerShown: false}}/>
        <MainStack.Screen name="MapView" component={MapViewScreen} options={{headerShown: false}}/>
    </MainStack.Navigator>
);

export default AppContainer;

export {DashboardNavigator, MemberListNavigator};