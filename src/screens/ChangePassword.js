import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import { colors } from '@theme/colors';
import { isPasswordConfirmed, isPasswordValid } from '@utils/validation';
import ToastComponent from '@components/toast/ToastComponent';
import { changePassword, validateToken } from '@api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePasswordScreen = (props) => {

    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [user, setUser] = useState({
        email: '',
        id: ''
    })
    const [errors, setErrors] = useState({
        passwordErrors: [],
        cpasswordErrors: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            (async () => {
                const user = await AsyncStorage.getItem('userDetails'); 
                setUser(JSON.parse(user));
            })();
        } catch(err) {
            console.warn("Error retrieving user details from storage:", err)
        }
    }, []);

    const handlePasswordChange = async() => {
        try{
        if(validatePasswords()) {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');

            //send to password reset api
            const response = await changePassword({email: user.email, password, confirm: cpassword}, token, user.main_user.id);
            if(response.status == 200) {
                ToastComponent.show("Password updated", {timeOut: 3500, level: 'success'})
            }
            const tokenResponse = await validateToken(token);
            setLoading(false);
            if(tokenResponse.status !== 200) navigateSignin();
        } else {
            ToastComponent.show("Invalid details", {timeOut: 3500, level: 'failure'})
        }
        } catch(error) {
            console.error("Error updating password", error);
        }
    }

    const navigateSignin = () => {
        props.navigation.navigate('Auth', {
            screen: 'Signin'
        });
    }

    const validatePasswords = () => {
        const passwordErrors = isPasswordValid(password);
        const cpasswordErrors = isPasswordConfirmed(password, cpassword);
        setErrors({passwordErrors, cpasswordErrors});
        return ![passwordErrors, cpasswordErrors].some(arr => arr.length != 0);
    }

    const navigateBack = () => {
        props.navigation.goBack();
    }

    return (
        <ScrollView contentContainerStyle={styles.signupContainer} showsVerticalScrollIndicator={false}>
            <Spinner visible={loading} textContent="Updating password..." textStyle={{color: colors.white}} color={colors.primary}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
            </View>
            <View style={styles.subTitleView}>
            <Text style={styles.logoText}>Reset Password</Text>
                <Text style={styles.subTitle}>Enter your new password </Text>
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Password" onChangeText={setPassword} value={password} hidden/>
                {errors.passwordErrors.length > 0 && <HelperTextComponent text={errors.passwordErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Confirm Password" onChangeText={setCPassword} value={cpassword} hidden/>
                {errors.cpasswordErrors.length > 0 && <HelperTextComponent text={errors.cpasswordErrors[0]} invalid/>}
            </View>
            <View>
                <ButtonComponent title="Reset Password" onPress={handlePasswordChange} buttonContainerStyle={styles.buttonComponent}/>
            </View>
        </ScrollView>
    );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 25,
        backgroundColor: colors.white,
        position: 'relative'
    },
    logoComponentView: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    subTitleView: {
        marginBottom: 20
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'center'
    },
    buttonComponent: {
        maxWidth: '100%',
        marginTop: 30
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: '15%'
    },
    formInputView: {
        marginTop: 20
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5
    }
});