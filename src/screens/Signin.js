import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import LogoComponent from '@components/logo/LogoComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import LinkTextComponent from '@components/link-text/LinkTextComponent';
import { colors } from '@theme/colors';
import { login } from '@api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastComponent from '@components/toast/ToastComponent';
import { isEmailValid, isPasswordValid } from '@utils/validation';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import SpinnerComponent from '@components/spinner/SpinnerComponent';

const SignInScreen = (props) => {

    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        emailErrors: [],
        passwordErrors: []
    });
    const [loading, setLoading] = useState(false);

    const navigateSignup = () => {
        props.navigation.navigate('Signup');
    }

    const navigateVerifyEmail = () => {
        props.navigation.navigate('VerifyEmail', {
            email: loginDetails.email
        });
    }

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const navigateDashboard = () => {
        props.navigation.navigate('Tabs');
    }

    const setEmail = (email) => {
        setLoginDetails({...loginDetails, email});
    }

    const setPassword = (password) => {
        setLoginDetails({...loginDetails, password});
    }

    const validateLoginDetails = () => {
        const emailErrors = isEmailValid(loginDetails.email);
        const passwordErrors = isPasswordValid(loginDetails.password);
        setErrors({emailErrors, passwordErrors});
        return ![emailErrors, passwordErrors].some(arr => arr.length > 0);
    }

    const handleSignIn = async() => {
        try {
        if(validateLoginDetails()) {
            setLoading(true);
            let response = await login(loginDetails);
            setLoading(false);
            if(response.status == 200) {
                await AsyncStorage.setItem('authToken', response.token);
                await AsyncStorage.setItem('userDetails', JSON.stringify(response.alldata[0]));
                navigateDashboard();
            } else if(response.status == 400 && response.msg == "not verified.") {
                ToastComponent.show("Please verify your account before you can login", {timeOut: 3500, level: 'warning'});
                navigateVerifyEmail();
            } else if(response.status == 400 && response.msg == 'pending approval.') {
                ToastComponent.show("Login failed. Please contact the admin for approval", {timeOut: 3500, level: 'warning'});
            } else {
                ToastComponent.show("Login failed", {timeOut: 3500, level: 'failure'});
            }
        } else {
            ToastComponent.show("Invalid login credentials", {timeOut: 3500, level: 'failure'});
        }
        } catch (error) {
            ToastComponent.show("User sign in failed", {timeOut: 3500, level: 'failure'});
            console.error("User sign in failed", error);
        }
    }

    return (
        <View style={styles.signupContainer}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <LogoComponent logoText="Sign In"/>
            </View>
            <View style={styles.subTitleView}>
                <Text style={styles.subTitle}>Connect with your peers. Log into your account</Text>
            </View>
            <View style={styles.formInputView}>
            <FormInputComponent label="Email Address" onChangeText={setEmail} value={loginDetails.email} invalid={errors.emailErrors.length > 0} keyboardType="email-address"/>
            {errors.emailErrors.length > 0 && <HelperTextComponent text={errors.emailErrors[0]} invalid />}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Password" onChangeText={setPassword} value={loginDetails.password} hidden invalid={errors.passwordErrors.length > 0}/>
                {errors.passwordErrors.length > 0 && <HelperTextComponent text={errors.passwordErrors[0]} invalid/>}
            </View>
            <View>
                <ButtonComponent title="Sign in" onPress={handleSignIn} buttonContainerStyle={styles.buttonComponent}/>
                <LinkTextComponent preText="" actionText="Forgot password?" onPress={() => {}}/>
                <LinkTextComponent preText="Don't have an account yet?" actionText="Sign up" onPress={navigateSignup}/>
            </View>
        </View>
    );
}

export default SignInScreen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 25,
        backgroundColor: colors.white,
        position: 'relative'
    },
    logoComponentView: {
        marginBottom: 35,
        flexDirection: 'row',
    },
    subTitleView: {
        marginBottom: 30
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'center'
    },
    inputWithIconView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    emailInputView: {
        width: '82%'
    },
    formInputView: {
        marginTop: 20
    },
    buttonComponent: {
        maxWidth: '100%',
        marginTop: 25,
        marginBottom: 10
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: '25%'
    }
});