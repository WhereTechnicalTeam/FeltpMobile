import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import LogoComponent from '@components/logo/LogoComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import { colors } from '@theme/colors';
import DatePickerComponent from '@components/date-picker/DatePickerComponent';
import { isAlphaTextValid, isDateValid, isNumericTextValid, isPhoneNumberPresentValid, isPhoneNumberValid, isTextValid } from '@utils/validation';
import ToastComponent from '@components/toast/ToastComponent';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import { safeConvertToString } from '@utils/helperFunctions';
import PickerComponent from '@components/picker/PickerComponent';

const IntermediateSignUpScreen = (props) => {

    const [frontlineExpanded, setFrontlineExpanded] = useState(false);
    const [intermediateExpanded, setIntermediateExpanded] = useState(false);
    const [advancedExpanded, setAdvancedExpanded] = useState(false);
    const [user, setUser] = useState({
        main_user: {
            phone1: '',
            phone2: null,
            is_trained_frontline: "No",
            cohort_number_frontline: null,
            yr_completed_frontline: null,
            institution_enrolled_at_frontline: null,
            job_title_at_enroll_frontline: null,
            is_trained_intermediate: "No",
            yr_completed_intermediate: null,
            institution_enrolled_at_intermediate: null,
            job_title_at_enroll_intermediate: null,
            cohort_number_intermediate: null,
            is_trained_advanced: "No",
            cohort_number_advanced: null,
            yr_completed_advanced: null,
            institution_enrolled_at_advanced: null,
            job_title_at_enroll_advanced: null,
            image: null,
        }
    });

    const [errors, setErrors] = useState({
        primaryPhoneErrors: [],
        secondaryPhoneErrors: [],
        cohortNumberFrontlineErrors: [],
        yrCompletedFrontlineErrors: [],
        jobTitleFrontlineErrors: [],
        institutionFrontlineErrors: [],
        cohortNumberIntermediateErrors: [],
        yrCompletedIntermediateErrors: [],
        jobTitleIntermediateErrors: [],
        institutionIntermediateErrors: [],
        cohortNumberAdvancedErrors: [],
        yrCompletedAdvancedErrors: [],
        jobTitleAdvancedErrors: [],
        institutionAdvancedErrors: [],
    });

    useEffect(() => {
        try {
            const forwardedUser = props.route.params.user;
            setUser(prevUser => {
                let {main_user} = prevUser;
                main_user = {...main_user, ...forwardedUser.main_user}
                return {...forwardedUser, main_user};
            });
            if(forwardedUser.main_user.is_trained_frontline == 'Yes') {
                setFrontlineExpanded(true);
            } 
            if(forwardedUser.main_user.is_trained_intermediate == 'Yes') {
                setIntermediateExpanded(true);
            }
            if(forwardedUser.main_user.is_trained_advanced == 'Yes') {
                setAdvancedExpanded(true);
            }            
        } catch(err) {
            console.warn("Error setting up intermediate sign up:", err);
        }
    }, []);

    const navigateSignupWithMap = () => {
        try {
            if(validateUserDetails()) {
                let {main_user} = user;
                main_user = {...main_user, phone1: cleanInput(main_user.phone1), phone2: cleanInput(main_user.phone2)}
                props.navigation.navigate('SignupWithMap', {
                    user: {...user, main_user}
                });
            } else {
                ToastComponent.show("Invalid details", {timeOut: 3500, level: 'failure'});
            }
        } catch(err) {
            console.warn("Error navigating to sign up with map:", err);
        }
    }

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const validateUserDetails = () => {   
        const primaryPhoneErrors = isPhoneNumberPresentValid(cleanInput(user.main_user.phone1));
        const secondaryPhoneErrors = isPhoneNumberValid(cleanInput(user.main_user.phone2));
        const institutionFrontlineErrors = frontlineExpanded ? isTextValid(user.main_user.institution_enrolled_at_frontline) : [];
        const jobTitleFrontlineErrors = frontlineExpanded ? isAlphaTextValid(user.main_user.job_title_at_enroll_frontline) : [];
        const yrCompletedFrontlineErrors = frontlineExpanded ? isDateValid(user.main_user.yr_completed_frontline, true) : [];
        const cohortNumberFrontlineErrors = frontlineExpanded ? isNumericTextValid(user.main_user.cohort_number_frontline) : [];
        const institutionIntermediateErrors = intermediateExpanded ? isTextValid(user.main_user.institution_enrolled_at_intermediate) : [];
        const jobTitleIntermediateErrors = intermediateExpanded ? isAlphaTextValid(user.main_user.job_title_at_enroll_intermediate) : [];
        const yrCompletedIntermediateErrors = intermediateExpanded ? isDateValid(user.main_user.yr_completed_intermediate) : [];
        const cohortNumberIntermediateErrors = intermediateExpanded ? isNumericTextValid(user.main_user.cohort_number_intermediate) : [];
        const institutionAdvancedErrors = advancedExpanded ? isTextValid(user.main_user.institution_enrolled_at_intermediate) : [];
        const jobTitleAdvancedErrors = advancedExpanded ? isAlphaTextValid(user.main_user.job_title_at_enroll_intermediate) : [];
        const yrCompletedAdvancedErrors = advancedExpanded ? isDateValid(user.main_user.yr_completed_intermediate) : [];
        const cohortNumberAdvancedErrors = advancedExpanded ? isNumericTextValid(user.main_user.cohort_number_intermediate) : [];

        setErrors({primaryPhoneErrors, secondaryPhoneErrors, institutionFrontlineErrors, jobTitleFrontlineErrors, yrCompletedFrontlineErrors, 
            cohortNumberFrontlineErrors, institutionIntermediateErrors, jobTitleIntermediateErrors, yrCompletedIntermediateErrors, cohortNumberIntermediateErrors,
            institutionAdvancedErrors, jobTitleAdvancedErrors, yrCompletedAdvancedErrors, cohortNumberAdvancedErrors
        }); 
        return ![primaryPhoneErrors, secondaryPhoneErrors, institutionFrontlineErrors, jobTitleFrontlineErrors, yrCompletedFrontlineErrors, 
            cohortNumberFrontlineErrors, institutionIntermediateErrors, jobTitleIntermediateErrors, yrCompletedIntermediateErrors, cohortNumberIntermediateErrors,
            institutionAdvancedErrors, jobTitleAdvancedErrors, yrCompletedAdvancedErrors, cohortNumberAdvancedErrors].some(arr => arr.length > 0);
    }

    const cleanInput = (input) => {
        return !input ? '' : input.replace(' - ', '').replace(' - ', '');
    }

    const setPrimaryPhone = (pPhone) => {
        let phone1 = pPhone;
        let {main_user} = user;
        // if (pPhone.length == 3)
        //     phone1 += ' - '
        // if (pPhone.length == 9) {
        //     phone1 += ' - '
        // }
        main_user = {...main_user, phone1}
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setSecondaryPhone = (sPhone) => {
        let phone2 = sPhone;
        let {main_user} = user;
        // if (sPhone.length == 3)
        //     phone2 += ' - '
        // if (sPhone.length == 9) {
        //     phone2 += ' - '
        // }
        main_user = {...main_user, phone2}
        setUser(prevUser => ({...prevUser, main_user})); //TODO: add format phone Number function
    }

    const setIsTrainedFrontline = (is_trained_frontline) => {
        let {main_user} = user;
        main_user = {...main_user, is_trained_frontline};
        setUser(prevUser => ({...prevUser, main_user}));
        setFrontlineExpanded(is_trained_frontline == 'Yes');
    }

    const setCohortFrontline = (cohort_number_frontline) => {
        let {main_user} = user;
        main_user = {...main_user, cohort_number_frontline};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setInstitutionFrontline = (institution_enrolled_at_frontline) => {
        let {main_user} = user;
        main_user = {...main_user, institution_enrolled_at_frontline};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setJobTitleFrontline = (job_title_at_enroll_frontline) => {
        let {main_user} = user;
        main_user = {...main_user, job_title_at_enroll_frontline};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setJobTitleIntermediate = (job_title_at_enroll_intermediate) => {
        let {main_user} = user;
        main_user = {...main_user, job_title_at_enroll_intermediate};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setJobTitleAdvanced = (job_title_at_enroll_advanced) => {
        let {main_user} = user;
        main_user = {...main_user, job_title_at_enroll_advanced};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setYearCompletedFrontline = (yr_completed_frontline) => {
        let {main_user} = user;
        main_user = {...main_user, yr_completed_frontline};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setYearCompletedIntermediate = (yr_completed_intermediate) => {
        let {main_user} = user;
        main_user = {...main_user, yr_completed_intermediate};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setIsTrainedIntermediate = (is_trained_intermediate) => {
        let {main_user} = user;
        main_user = {...main_user, is_trained_intermediate};
        setUser(prevUser => ({...prevUser, main_user}));
        setIntermediateExpanded(is_trained_intermediate == 'Yes');
    }

    const setCohortIntermediate = (cohort_number_intermediate) => {
        let {main_user} = user;
        main_user = {...main_user, cohort_number_intermediate};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setInstitutionIntermediate = (institution_enrolled_at_intermediate) => {
        let {main_user} = user;
        main_user = {...main_user, institution_enrolled_at_intermediate};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setYearCompletedAdvanced = (yr_completed_advanced) => {
        let {main_user} = user;
        main_user = {...main_user, yr_completed_advanced}
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setIsTrainedAdvanced = (is_trained_advanced) => {
        let {main_user} = user;
        main_user = {...main_user, is_trained_advanced};
        setUser(prevUser => ({...prevUser, main_user}));
        setAdvancedExpanded(is_trained_advanced == 'Yes');
    }

    const setCohortAdvanced = (cohort_number_advanced) => {
        let {main_user} = user;
        main_user = {...main_user, cohort_number_advanced};
        setUser(prevUser => ({...prevUser, main_user}));
    }

    const setInstitutionAdvanced = (institution_enrolled_at_advanced) => {
        let {main_user} = user;
        main_user = {...main_user, institution_enrolled_at_advanced};
        setUser(prevUser => ({...prevUser, main_user}));
    }   
    
    const pickerList = [{id: "No", name: "No"}, {id: "Yes", name: "Yes"}];
    
    return (
        <SafeAreaView style={styles.signupContainer}>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <LogoComponent logoText="Signup"/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.formInputView]}>
                <FormInputComponent label="Primary Phone Number" onChangeText={setPrimaryPhone} invalid={errors.primaryPhoneErrors.length > 0} value={user.main_user.phone1} keyboardType="numeric" placeholder="XXX - XXX - XXXX" maxLength = {10}/>
                {errors.primaryPhoneErrors.length > 0 && <HelperTextComponent text={errors.primaryPhoneErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
                <FormInputComponent label="Secondary Phone Number" onChangeText={setSecondaryPhone} invalid={errors.secondaryPhoneErrors.length > 0} value={user.main_user.phone2} keyboardType="numeric" placeholder="XXX - XXX - XXXX" maxLength = {10}/>
                {errors.secondaryPhoneErrors.length > 0 && <HelperTextComponent text={errors.secondaryPhoneErrors[0]} invalid/>}
            </View>
            <View style={[styles.formInputView]}>
                <PickerComponent label="Have you been trained in Frontline?" items={pickerList} onValueChange={setIsTrainedFrontline} selectedValue={user.main_user.is_trained_frontline} mode="dropdown"/>
            </View>
            {
                frontlineExpanded &&
                (
                <View style={styles.levelDetailsContainer}>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Name of Institution" onChangeText={setInstitutionFrontline} value={user.main_user.institution_enrolled_at_frontline} invalid={errors.institutionFrontlineErrors.length > 0}/>
                    {errors.institutionFrontlineErrors.length > 0 && <HelperTextComponent text={errors.institutionFrontlineErrors[0]} invalid/>}
                </View>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Job Title" value={user.main_user.job_title_at_enroll_frontline} onChangeText={setJobTitleFrontline} invalid={errors.jobTitleFrontlineErrors.length > 0}/>
                    {errors.jobTitleFrontlineErrors.length > 0 && <HelperTextComponent text={errors.jobTitleFrontlineErrors[0]} invalid/>}
                </View>
                <View style={styles.levelDetailsView}>
                    <View style={styles.formInputSubView}>
                        <FormInputComponent label="Cohort Number" keyboardType="numeric" onChangeText={setCohortFrontline} value={safeConvertToString(user.main_user.cohort_number_frontline)} invalid={errors.cohortNumberFrontlineErrors.length > 0}/>
                        {errors.cohortNumberFrontlineErrors.length > 0 && <HelperTextComponent text={errors.cohortNumberFrontlineErrors[0]} invalid/>}
                    </View>
                    <View style={styles.formInputSubView}>
                        <FormInputComponent label="Year Completed" maxLength = {4} keyboardType="numeric" onChangeText={setYearCompletedFrontline} value={user.main_user.yr_completed_frontline} invalid={errors.yrCompletedFrontlineErrors.length > 0}/>
                        {errors.yrCompletedFrontlineErrors.length > 0 && <HelperTextComponent text={errors.yrCompletedFrontlineErrors[0]} invalid/>}
                    </View>
                </View>
                </View>) 
            }
            <View style={[styles.formInputView]}>
                <PickerComponent items={pickerList} label="Have you been trained in Intermediate?" onValueChange={setIsTrainedIntermediate} selectedValue={user.main_user.is_trained_intermediate} mode="dropdown"/>
            </View>
            {
                intermediateExpanded &&
                (<View style={styles.levelDetailsContainer}>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Name of Institution" onChangeText={setInstitutionIntermediate} value={user.main_user.institution_enrolled_at_intermediate} invalid={errors.institutionIntermediateErrors.length > 0}/>
                    {errors.institutionIntermediateErrors.length > 0 && <HelperTextComponent text={errors.institutionIntermediateErrors[0]} invalid/>}
                </View>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Job Title" value={user.main_user.job_title_at_enroll_intermediate} onChangeText={setJobTitleIntermediate} invalid={errors.jobTitleIntermediateErrors.length > 0}/>
                    {errors.jobTitleIntermediateErrors.length > 0 && <HelperTextComponent text={errors.jobTitleIntermediateErrors[0]} invalid/>}
                </View>
                <View style={styles.levelDetailsView}>
                    <View style={styles.formInputSubView}>
                    <FormInputComponent label="Cohort Number" keyboardType="numeric" onChangeText={setCohortIntermediate} value={safeConvertToString(user.main_user.cohort_number_intermediate)} invalid={errors.cohortNumberIntermediateErrors.length > 0}/>
                    {errors.cohortNumberIntermediateErrors.length > 0 && <HelperTextComponent text={errors.cohortNumberIntermediateErrors[0]} invalid/>}
                    </View>
                    <View style={styles.formInputSubView}>
                        <FormInputComponent label="Year Completed" maxLength = {4} keyboardType="numeric" onChangeText={setYearCompletedIntermediate} value={user.main_user.yr_completed_intermediate} invalid={false} invalid={errors.yrCompletedIntermediateErrors.length > 0}/>
                    {errors.yrCompletedIntermediateErrors.length > 0 && <HelperTextComponent text={errors.yrCompletedIntermediateErrors[0]} invalid/>}
                    </View>
                </View>
                </View>)
            }
            <View style={[styles.formInputView]}>
                <PickerComponent items={pickerList} label="Have you been trained in Advanced?" onValueChange={setIsTrainedAdvanced} selectedValue={user.main_user.is_trained_advanced} mode="dropdown"/>
            </View>
            {
                advancedExpanded &&
                (<View style={styles.levelDetailsContainer}>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Name of Institution" onChangeText={setInstitutionAdvanced} value={user.main_user.institution_enrolled_at_advanced} invalid={errors.institutionAdvancedErrors.length > 0}/>
                    {errors.institutionAdvancedErrors.length > 0 && <HelperTextComponent text={errors.institutionAdvancedErrors[0]} invalid/>}
                </View>
                <View style={styles.formInputView}>
                    <FormInputComponent label="Job Title" value={user.main_user.job_title_at_enroll_advanced} onChangeText={setJobTitleAdvanced} invalid={errors.jobTitleAdvancedErrors.length > 0}/>
                    {errors.jobTitleAdvancedErrors.length > 0 && <HelperTextComponent text={errors.jobTitleAdvancedErrors[0]} invalid/>}
                </View>
                <View style={styles.levelDetailsView}>
                    <View style={styles.formInputSubView}>
                    <FormInputComponent label="Cohort Number" keyboardType="numeric" onChangeText={setCohortAdvanced} value={safeConvertToString(user.main_user.cohort_number_advanced)} invalid={errors.cohortNumberAdvancedErrors.length > 0}/>
                    {errors.cohortNumberAdvancedErrors.length > 0 && <HelperTextComponent text={errors.cohortNumberAdvancedErrors[0]} invalid/>}
                    </View>
                    <View style={styles.formInputSubView}>
                        <FormInputComponent label="Year Completed" keyboardType="numeric" maxLength = {4} onChangeText={setYearCompletedAdvanced} value={user.main_user.yr_completed_advanced} invalid={errors.yrCompletedAdvancedErrors.length > 0}/>
                    {errors.yrCompletedAdvancedErrors.length > 0 && <HelperTextComponent text={errors.yrCompletedAdvancedErrors[0]} invalid/>}
                    </View>
                </View>
                </View>)
            }
            <View>
                <ButtonComponent title="Next" onPress={navigateSignupWithMap} buttonContainerStyle={styles.buttonComponent}/>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

//TODO create custom picker component

export default IntermediateSignUpScreen;

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
    },
    buttonComponent: {
        maxWidth: '100%',
        marginTop: 30,
        marginBottom: 10
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
        marginRight: '25%'
    },
    levelDetailsView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formInputSubView: {
        marginTop: 20,
        width: '45%'
    },
    levelDetailsContainer: {
        borderColor: colors.secondaryBlack, 
        borderWidth: 0.5, 
        padding: 15, 
        marginTop: 5,
        borderRadius: 5,
    }
});