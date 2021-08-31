import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import FormInputComponent from '@components/input/FormInputComponent';
import ButtonComponent from '@components/button/ButtonComponent';

import { colors } from '@theme/colors';
import { isAlphaTextValid, isEmailValid, isDateValid } from '@utils/validation';
import DatePickerComponent from '@components/date-picker/DatePickerComponent';
import ToastComponent from '@components/toast/ToastComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import PickerComponent from '@components/picker/PickerComponent';

const EditProfileScreen = (props) => {

    const [user, setUser] = useState({
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
    });
    const [errors, setErrors] = useState({
        emailErrors: [],
        titleErrors: [],
        firstnameErrors: [],
        surnameErrors: [],
        genderErrors: [],
        dobErrors: [],
    });

    useEffect(() => {
        try{
        (async() => {
            const storedUser = await AsyncStorage.getItem('userDetails');
            setUser(JSON.parse(storedUser));
        })();
        } catch(error) {
            console.error("Error fetching user from storage:", error);
        } 
    }, []);

    const navigateEditProfile2 = () => {
        props.navigation.navigate('EditProfile2', {
            user
        });
    }

    const navigateBack = () => {
        props.navigation.goBack();
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

    const setTitle = (title) => {
        let {main_user} = user;
        main_user = {...main_user, title};
        setUser(prevState => ({...prevState, main_user}));
    }

    const setFirstName = (firstname) => {
        let {main_user} = user;
        main_user = {...main_user, firstname};
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

    const handleSubmit = () => {
        console.log(user);
        try {
            if(validateUserDetails()) {
                navigateEditProfile2();
            } else {
                ToastComponent.show("Validation failed", {timeOut: 3500, level: 'failure'});
            }
        } catch(err) {
            console.warn("Error submitting edit profile 1 details:", err)
        }
    }

    const validateUserDetails = () => {
        const emailErrors = isEmailValid(user.email);
        const firstnameErrors = isAlphaTextValid(user.main_user.firstname);
        const surnameErrors = isAlphaTextValid(user.main_user.surname);
        const genderErrors = isAlphaTextValid(user.main_user.sex);
        const dobErrors = isDateValid(user.main_user.date_of_birth, true);
        setErrors({titleErrors: [], emailErrors, firstnameErrors, surnameErrors, genderErrors, dobErrors});
        return ![emailErrors, firstnameErrors, surnameErrors, genderErrors, dobErrors]
        .some(arr => arr.length > 0);
    }

    return (
        <View style={styles.signupContainer}>
                {/* <Text style={styles.subTitle}>Edit your personal details</Text> */}
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formInputView}>
            <FormInputComponent label="Email Address" placeholder="Find your account" onChangeText={setEmail} value={user.email} invalid={errors.emailErrors.length > 0} keyboardType="email-address"/>
                {errors.emailErrors.length > 0 && <HelperTextComponent text={errors.emailErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Title" onChangeText={setTitle} value={user.main_user.title} invalid={errors.titleErrors.length > 0}/>
                {errors.titleErrors.length > 0 && <HelperTextComponent text={errors.titleErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="First Name" onChangeText={setFirstName} value={user.main_user.firstname} invalid={errors.firstnameErrors.length > 0}/>
                {errors.firstnameErrors.length > 0 && <HelperTextComponent text={errors.firstnameErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Last Name" onChangeText={setLastName} value={user.main_user.surname} invalid={errors.surnameErrors.length > 0}/>
                {errors.surnameErrors.length > 0 && <HelperTextComponent text={errors.surnameErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <PickerComponent label="Gender" onValueChange={setGender} selectedValue={user.main_user.sex} mode="dropdown" items={[{name: "", id: null}, {name: "Male", id: "Male"}, {name: "Female", id: "Female"}]}/>
                {errors.genderErrors.length > 0 && <HelperTextComponent text={errors.genderErrors[0]} invalid/>}
            </View>
            <View style={[styles.formInputView]}>
                <DatePickerComponent label="Date of Birth" onDateChange={handleDateChange} value={user.main_user.date_of_birth} invalid={errors.dobErrors.length > 0}/>
                {errors.dobErrors.length > 0 && <HelperTextComponent text={errors.dobErrors[0]} invalid/>}
            </View>
            <View>
                <ButtonComponent title="Next" onPress={handleSubmit} buttonContainerStyle={styles.buttonComponent} />
            </View>
            </ScrollView>
        </View>
    );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        // paddingTop: 20,
        paddingHorizontal: 25,
        paddingBottom: 15,
        backgroundColor: colors.white
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.lightPrimary
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
        marginTop: 25
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: '20%'
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