import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { logout } from '@api/authApi';
import HorizontalLineComponent from '@components/horizontal-line/HorizontalLine';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ListItemComponent from '@components/list-item/ListItemComponent';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';
import SpinnerComponent from '@components/spinner/SpinnerComponent';

const SettingsScreen = (props) => {

    const [userDetails, setUserDetails] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async() => {
        const user = await AsyncStorage.getItem('userDetails');
        setUserDetails(JSON.parse(user));
        })();
    }, []);

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const navigateChangePassword = () => {
        props.navigation.navigate('ChangePassword');
    }

    const handleLogout = async() => {
        Alert.alert('Logout', "Are you sure you want to log out?",
        [
            {
                text: 'Cancel',
                onPress: () => console.log('User cancelled logout')
            },
            {
                text: 'Yes',
                onPress: logoutUser
            }
        ]);
    }

    const logoutUser = async() => {
        //make logout api call
        try{
            setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        const response = await logout(token);
        // await AsyncStorage.removeItem('authToken');
        //     await AsyncStorage.removeItem('userDetails');
        setLoading(false);
        if(response.status == 200) {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userDetails');
            props.navigation.navigate('Auth', {
                screen: 'AuthLoading'
            });
        } else {
            ToastComponent.show("User logout failed", {timeOut: 3500, level: 'failure'});
        }
        } catch(error) {
            console.error("User logout failed", error);
            // ToastComponent.show("User logout failed", {timeOut: 3500, level: 'failure'});
        }
    }

    return (
        <View style={styles.settingsContainer}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.headerView}>
                <IconButtonComponent icon="close-outline" size={30} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <Text style={styles.screenTitle}>Settings</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.subcontentView}>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Change Password" onPress={navigateChangePassword} leftIcon="key" iconColor={colors.primary}/>
                    </View>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Account Settings" onPress={() => {}} leftIcon="settings" iconColor={colors.primary}/>
                    </View>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Logout" onPress={handleLogout} leftIcon="log-out" iconColor={colors.primary}/>
                    </View>
                    <HorizontalLineComponent hrWidth="90%"/>
                </View>
                <View style={styles.subcontentView}>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Help" onPress={() => {}} leftIcon="help-circle" iconColor={colors.primary}/>
                    </View>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Info" onPress={() => {}} leftIcon="information-circle" iconColor={colors.primary}/>
                    </View>
                    <View>
                        <ListItemComponent rightIcon="chevron-forward-outline" text="Data Privacy" onPress={() => {}} leftIcon="shield-checkmark" iconColor={colors.primary}/>
                    </View>
                    <HorizontalLineComponent hrWidth="85%"/>
                </View>
            </ScrollView>
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 30,
        backgroundColor: colors.white,
        position: 'relative'
    },
    headerView: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center'
    },
    screenTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: 80
    },
    subcontentView: {
        marginBottom: 15
    },
    listItemComponentView: {
        marginVertical: 10
    }
});