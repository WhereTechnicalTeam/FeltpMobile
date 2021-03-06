import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import LogoComponent from '@components/logo/LogoComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import LinkTextComponent from '@components/link-text/LinkTextComponent';
import { colors } from '@theme/colors';
import { isAlphaTextValid, isDateValid, isEmailValid, isPasswordConfirmed, isPasswordValid, isTextValid } from '@utils/validation';
import { findUserByEmail } from '@api/userApi';
import DatePickerComponent from '@components/date-picker/DatePickerComponent';
import ToastComponent from '@components/toast/ToastComponent';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import SpinnerComponent from '@components/spinner/SpinnerComponent';
import PickerComponent from '@components/picker/PickerComponent';
import { titleList } from '@utils/constants';
import { sendCode, verifyEmail, verifyNewUserEmail } from '@api/authApi';

const SignUpScreen = (props) => {
    
    const initUser = {
        email: '',
        password: '',
        cpassword: '',
        main_user: {
        title: '',
        firstname: '',
        surname: '',
        sex: '',
        date_of_birth: ''
        }
    };
    const [userSearchComplete, setUserSearchComplete] = useState(false);
    const [user, setUser] = useState(initUser);
    const [errors, setErrors] = useState({
        emailErrors: [],
        titleErrors: [],
        firstnameErrors: [],
        surnameErrors: [],
        genderErrors: [],
        passwordErrors: [],
        cpasswordErrors: [],
        dobErrors: [],
        validationCodeErrors: []
    });
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [validationCode, setValidationCode] = useState("");

    const navigateIntermediateSignup = () => {
        props.navigation.navigate('IntermediateSignup', {
            user,
        });
    }

    const navigateSignin = () => {
        props.navigation.navigate('Signin');
    }

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const handleUserSearch = async () => {
        console.log(user.email);
        try {
            const emailErrors = isEmailValid(user.email);
            if(emailErrors.length == 0) {
                setErrors(prevErrors => ({...prevErrors, emailErrors}));
                setLoading(true);
                const response = await findUserByEmail(user.email);
                if(response.status !== 200) {
                    setUser(prevUser => {
                        let {main_user} = prevUser;
                        main_user = {...main_user, status: 'registered', email_status: 'not verified'}
                        return {...prevUser, main_user};
                    }); 
                    // ToastComponent.show("User not found", {timeOut: 3500, level: 'warning'});
                    setShowPassword(true);
                    setUser({...initUser, email: user.email});
                } else {
                let foundUser = response.alldata[0];
                console.log("user", foundUser);
                // setVerified(foundUser.email_status == 'verified');
                setUser({...foundUser, job_to_user: [foundUser.job_to_user]});
                setShowPassword(false);
                ToastComponent.show("User account found", {timeOut: 3500, level: 'success'});
                }
                let tokenResponse = await sendCode(user.email);
                    if(tokenResponse.status !== 200) {
                        ToastComponent.show("Failed to send verification token", {timeOut: 3000, level: "failure"});
                    } else ToastComponent.show("Verification code sent!", {timeOut: 3500, level: "success"});
                setLoading(false);
                setUserSearchComplete(true);
            } else {
                ToastComponent.show("Email is invalid", {timeOut: 3500, level: 'failure'});
                console.log("emailErrors", emailErrors);
                setErrors(prevErrors => ({...prevErrors, emailErrors}));
            }
        }catch(error) {
            console.error("Error searching for user account", error)
        }
    }

    const handleDateChange = (selectedDate) => {
        console.log('selected date', selectedDate);
        setDob(selectedDate);
    }

    const setEmail = (email) => {
        setUser(prevState => ({...prevState, email}));
    }

    const setGender = (sex) => {
        let {main_user} = user;
        main_user = {...main_user, sex};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setFirstName = (firstname) => {
        let {main_user} = user;
        main_user = {...main_user, firstname};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setTitle = (title) => {
        let {main_user} = user;
        main_user = {...main_user, title};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setLastName = (surname) => {
        let {main_user} = user;
        main_user = {...main_user, surname};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setDob = (date_of_birth) => {
        let {main_user} = user;
        main_user = {...main_user, date_of_birth};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setPassword = (password) => {
        setUser(prevState => ({...prevState, password}));
    }

    const setConfirmPassword = (cpassword) => {
        setUser(prevState => ({...prevState, cpassword}));
    }

    const handleSubmit = async() => {
        try {
            setLoading(true);
            if(userSearchComplete && !verified) {
                const validationCodeErrors = isTextValid(validationCode);
                setErrors({...errors, validationCodeErrors});
                if(validationCodeErrors.length == 0) {
                    let response;
                    if(!showPassword) response = await verifyEmail(validationCode);
                    else response = await verifyNewUserEmail(validationCode);
                    console.log("verification response:", response);
                    if(response.status == 200) {
                        ToastComponent.show("Account verified!", {timeOut: 3000, level: 'success'})
                        setVerified(true);
                    } else {
                        ToastComponent.show("Account verification failed!", {timeOut: 3000, level: 'failure'})
                    }
                }
            } else {
            if(validateUserDetails()) {
                navigateIntermediateSignup();
            } else {
                ToastComponent.show("Validation failed", {timeOut: 3500, level: 'failure'});
            }
            }
            setLoading(false);
        } catch(err) {
            setLoading(false);
            console.warn("Error navigating to intermediate sign up:", err);
        }
        
    }

    const validateUserDetails = () => {
        const emailErrors = isEmailValid(user.email);
        const firstnameErrors = isAlphaTextValid(user.main_user.firstname);
        const surnameErrors = isAlphaTextValid(user.main_user.surname);
        const genderErrors = isAlphaTextValid(user.main_user.sex);
        const dobErrors = isDateValid(user.main_user.date_of_birth, true);
        const passwordErrors = showPassword ? isPasswordValid(user.password) : [];
        const cpasswordErrors = showPassword ? isPasswordConfirmed(user.password, user.cpassword) : [];
        setErrors({titleErrors: [], emailErrors, firstnameErrors, surnameErrors, genderErrors, dobErrors, passwordErrors, cpasswordErrors});
        return ![emailErrors, firstnameErrors, surnameErrors, genderErrors, dobErrors, passwordErrors, cpasswordErrors]
        .some(arr => arr.length > 0);
    }

    return (
        <View style={styles.signupContainer}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <LogoComponent logoText="Sign Up" logoStyle={styles.logoStyle}/>
            </View>
            <View style={styles.subTitleView}>
                <Text style={styles.subTitle}>{
                userSearchComplete && !verified ?
                `A verification code has been sent to: ${user.email}`
                : 'Connect with your peers. Create an account'
                }</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputWithIconView}>
                <View style={[styles.emailInputView]}>
                    <FormInputComponent label="Email Address" placeholder="Find your account" onChangeText={setEmail} value={user.email} invalid={errors.emailErrors.length > 0} keyboardType="email-address"/>
                    {errors.emailErrors.length > 0 && <HelperTextComponent text={errors.emailErrors[0]} invalid/>}
                </View>
                <IconButtonComponent 
                    type="ionicons" 
                    icon="ios-search-outline" 
                    size={25} 
                    color={colors.white}
                    onPress={handleUserSearch}
                    iconButtonStyle={errors.emailErrors.length > 0 ? {marginBottom: '8%'} : {} }
                />
            </View>
            {
                userSearchComplete && !verified ?
                <View style={styles.formInputView}>
                    <FormInputComponent label="Verification Code" value={validationCode} onChangeText={setValidationCode} invalid={errors.validationCodeErrors.length > 0}/>
                </View>
                : null
            }
            {
                verified ? 
                <View>
            <View style={styles.formInputView}>
                <PickerComponent items={titleList} label="Title" onValueChange={setTitle} disabled={!userSearchComplete} selectedValue={user.main_user.title} invalid={errors.titleErrors.length > 0} mode="dropdown"/>
                {errors.titleErrors.length > 0 && <HelperTextComponent text={errors.titleErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="First Name" onChangeText={setFirstName} disabled={!userSearchComplete} value={user.main_user.firstname} invalid={errors.firstnameErrors.length > 0}/>
                {errors.firstnameErrors.length > 0 && <HelperTextComponent text={errors.firstnameErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Last Name" onChangeText={setLastName} disabled={!userSearchComplete} value={user.main_user.surname} invalid={errors.surnameErrors.length > 0}/>
                {errors.surnameErrors.length > 0 && <HelperTextComponent text={errors.surnameErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <PickerComponent items={[{id: null, name: ""}, {id: "Male", name: "Male"}, {id: "Female", name: "Female"}]} label="Gender" invalid={errors.genderErrors.length > 0 } disabled={!userSearchComplete} onValueChange={setGender} selectedValue={user.main_user.sex} mode="dropdown"/>
                {errors.genderErrors.length > 0 && <HelperTextComponent text={errors.genderErrors[0]} invalid/>}
            </View>
            <View style={[styles.formInputView]}>
                <DatePickerComponent label="Date of Birth" onDateChange={handleDateChange} value={user.main_user.date_of_birth} disabled={!userSearchComplete} invalid={errors.dobErrors.length > 0}/>
                {errors.dobErrors.length > 0 && <HelperTextComponent text={errors.dobErrors[0]} invalid/>}
            </View>
            {showPassword &&(
            <>
            <View style={styles.formInputView}>
                <FormInputComponent label="Password" onChangeText={setPassword} hidden disabled={!userSearchComplete} value={user.password} invalid={errors.passwordErrors.length > 0}/>
                {errors.passwordErrors.length > 0 && <HelperTextComponent text={errors.passwordErrors[0]} invalid/>}
            </View> 
            <View style={styles.formInputView}>
                <FormInputComponent label="Confirm Password" onChangeText={setConfirmPassword} hidden disabled={!userSearchComplete} value={user.cpassword} invalid={errors.cpasswordErrors.length > 0}/>
                {errors.cpasswordErrors.length > 0 && <HelperTextComponent text={errors.cpasswordErrors[0]} invalid/>}
            </View>
            </>)}                    
                </View>
                : 
                null
            }
            <View>
                <ButtonComponent title={userSearchComplete && !verified ? "Verify email" : "Next"} onPress={handleSubmit} buttonContainerStyle={styles.buttonComponent} disabled={!userSearchComplete} />
                <LinkTextComponent preText="Already have an account?" actionText="Login" onPress={navigateSignin}/>
            </View>
            </ScrollView>
        </View>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 30,
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
        alignSelf: 'flex-start',
        marginRight: '25%'
    },
    pickerView: {
        borderRadius: 5,
        borderColor: colors.secondaryBlack,
        borderWidth: 0.8,       
        height: 50,
        justifyContent: 'center' 
    },
    pickerText: {
        fontSize: 15,
        marginBottom: 5
    }
});