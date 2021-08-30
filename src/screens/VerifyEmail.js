import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { verifyEmail } from '@api/authApi';
import ButtonComponent from '@components/button/ButtonComponent';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import LogoComponent from '@components/logo/LogoComponent';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';
import { isTextValid } from '@utils/validation';
import { safeConvertToString } from '@utils/helperFunctions';
import SpinnerComponent from '@components/spinner/SpinnerComponent';

const VerifyEmailScreen = (props) => {

    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const email = props.route.params?.email;
        setEmail(email);
    }, [props.route.params?.email]);

    const handleVerification = async() => {
        console.log("validation code:", code);
        try {
            if(validateCode()) {
                setLoading(true);
                const response = await verifyEmail(code);
                setLoading(false);
                console.log("response:", response);
                if(response.status == 200) {
                    ToastComponent.show("Account verified successfully", {timeOut: 3500, level: 'success'});                
                    navigateSignin();
                } else if(response.status == 400 && response.msg == 'This verification code does not exist.') {
                    ToastComponent.show("Invalid verification code", {timeOut: 3500, level: 'failure'});                
                } else {
                    ToastComponent.show("Account verification failed", {timeOut: 3500, level: 'failure'});                
                }
            } else {
                ToastComponent.show("Code entered is invalid", {timeOut: 3500, level: 'failure'});                
            }             
        } catch(err) {
            console.warn("Error verifying code:", err);
        }  
    }

    const navigateSignin = () => {
        props.navigation.navigate('Signin');
    }

    const navigateBack = () => {
        if(props.navigation)
        props.navigation.goBack();
    }

    const validateCode = () => {
        const codeErrors = isTextValid(code, 1);
        setError(codeErrors);
        return codeErrors.length == 0;
    }

    return (
        <ScrollView contentContainerStyle={styles.signupContainer} showsVerticalScrollIndicator={false}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <LogoComponent logoText="Verify Email"/>
            </View>
            <View style={styles.subTitleView}>
                <Text style={styles.subTitle}>A verification code has been sent to: </Text>
                <Text style={{color: colors.primary, textAlign: 'center'}}>{safeConvertToString(email)}</Text>
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Verification Code" onChangeText={setCode} value={code}/>
                {error.length > 0 && <HelperTextComponent text={error[0]} invalid/>}
            </View>
            <View>
                <ButtonComponent title="Verify Email" onPress={handleVerification} buttonContainerStyle={styles.buttonComponent}/>
            </View>
            <View>
                <ButtonComponent title="Resend Code" onPress={() => console.log("Resending token to ", email)} buttonContainerStyle={{...styles.buttonComponent, backgroundColor: colors.primaryGreen}}/>
            </View>
        </ScrollView>
    );
}

export default VerifyEmailScreen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 25,
        backgroundColor: colors.white
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
    buttonComponent: {
        maxWidth: '100%',
        marginTop: 30
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: '20%'
    },
    formInputView: {
        marginTop: 20
    },
});