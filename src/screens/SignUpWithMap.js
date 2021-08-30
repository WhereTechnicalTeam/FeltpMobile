import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import LogoComponent from '@components/logo/LogoComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import LinkTextComponent from '@components/link-text/LinkTextComponent';

import { colors } from '@theme/colors';
import MapPreviewComponent from '@components/map-preview/MapPreviewComponent';
import { registerUser } from '@api/authApi';
import { updateUser } from '@api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastComponent from '@components/toast/ToastComponent';
import { isAlphaTextValid, isDefined, isTextValid, isEmpty } from '@utils/validation';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import { getDistrictListByRegion, safeConvertToString } from '@utils/helperFunctions';
import DropdownComponent from '@components/dropdown/DropdownComponent';
import { levelOfHSList, RegionList } from '@utils/constants';
import SpinnerComponent from '@components/spinner/SpinnerComponent';

const SignUpWithMapScreen = (props) => {

    const [user, setUser] = useState({
        job_to_user: [{
            current_institution: null,
            job_title: null,
            region: null,
            district: null,
            level_of_health_system: null,
            longitude: null,
            latitude: null,
            is_current: 'Yes',
            employment_status: "full-time"
        }]
    });
    const [selectedRegion, setSelectedRegion] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        officePositionErrors: [],
        currentInstitutionErrors: [],
        jobTitleErrors: [],
        regionErrors: [],
        districtErrors: [],
        healthSystemErrors: []
    });

    useEffect(() => {
        try {
            const previousUserDetails = props.route.params?.user;
            let incoming_job_to_user = isDefined(previousUserDetails.job_to_user) ? previousUserDetails.job_to_user : []
            setUser(prevUser => {
                let {job_to_user} = prevUser;
                job_to_user = [...job_to_user, ...incoming_job_to_user]; //merge job_to_user
                return {...previousUserDetails, job_to_user}; 
            });        
        } catch(err) {
            console.warn("Error setting up sign up with map:", err);
        }
    }, []);

    useEffect(() => {
        console.log("office marker", props.route.params.officeMarkerPosition);
        if(props.route.params?.officeMarkerPosition) {
            console.log("office marker", props.route.params.officeMarkerPosition);
            setOfficePosition(props.route.params.officeMarkerPosition);
        }
    }, [props.route.params?.officeMarkerPosition]);

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const navigateMapView = () => {
        props.navigation.navigate('MapView');
    }

    const navigateVerifyEmail = () => {
        props.navigation.navigate('VerifyEmail',
        {
            email: user.email
        });
    }

    const handleSubmit = async() => {
        console.log(user);
        try {
        if(validateUserDetails()) {
            setLoading(true);
            let response = null;
            if(user.main_user.status === 'pending approval' || user.main_user.status === 'approved') response = await updateUser({...user, job_to_user: [user.job_to_user[0]]}, user.id)
            else response = await registerUser(user)
            console.log("register response: ", response);
            setLoading(false);
            if(response.status == 200 || isDefined(response.email)) {
                // let authUser = response.user;
                await AsyncStorage.setItem('userDetails', JSON.stringify(user));

                ToastComponent.show("Registration successful!", {timeOut: 3500, level: 'success'});
                if(user.main_user.email_status == 'verified') {
                    // navigateDashboard();
                    // await AsyncStorage.setItem('authToken', response.token);
                    navigateSignin();
                } else {
                    navigateVerifyEmail();           
               }
            } else {
                ToastComponent.show("Registration failed", {timeOut: 3500, level: 'failure'});
            }
        } else {
            ToastComponent.show("Validation failed", {timeOut: 3500, level: 'failure'});                
        }
        } catch(error) {
            console.warn("Error during registration:", error);
        }
    }

    const isUserOfficeLocationSet = () => {
        const {is_current, latitude, longitude} = user.job_to_user[0];
        return is_current == 'Yes' && (isDefined(latitude) && !isEmpty(latitude)) && (isDefined(longitude) && !isEmpty(longitude));
    }

    const navigateDashboard = () => {
        props.navigation.navigate('Tabs');
    }

    const setCurrentInstitution = (current_institution) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], current_institution};
        setUser(prevUser => ({...prevUser, job_to_user}));
    }

    const setCurrentJobTitle = (job_title) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], job_title};
        setUser(prevUser => ({...prevUser, job_to_user}));
    }

    const setCurrentRegion = (region) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], region};
        setUser(prevUser => ({...prevUser, job_to_user}));
        if(isDefined(region))
        setSelectedRegion(RegionList.filter(reg => reg.id == region)[0].name)
        else {
            setSelectedRegion(safeConvertToString(region));
            setCurrentDistrict(null);
        }
    }

    const setCurrentDistrict = (district) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], district};
        setUser(prevUser => ({...prevUser, job_to_user}));
    }

    const setLevelOfHealthSystem = (level_of_health_system) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], level_of_health_system};
        setUser(prevUser => ({...prevUser, job_to_user}));
    }

    const setOfficePosition = (officePosition) => {
        let {job_to_user} = user;
        job_to_user[0] = {...job_to_user[0], longitude: officePosition.longitude, latitude: officePosition.latitude};
        setUser(prevUser => ({...prevUser, job_to_user}));
    }

    const validateUserDetails = () => {
        // const currentInstitutionErrors = isTextValid(user.job_to_user[0].current_institution);
        // const jobTitleErrors = isAlphaTextValid(user.job_to_user[0].job_title);
        // const regionErrors = isTextValid(user.job_to_user[0].region);
        // const districtErrors = isTextValid(user.job_to_user[0].district);
        // const healthSystemErrors = isTextValid(user.job_to_user[0].level_of_health_system);
        // const officePositionErrors = [...isTextValid(user.job_to_user[0].latitude, 1), ...isTextValid(user.job_to_user[0].longitude, 1)];
        // setErrors({currentInstitutionErrors, jobTitleErrors, regionErrors, districtErrors, healthSystemErrors, officePositionErrors});
        // console.log(errors);
        // return ![currentInstitutionErrors, jobTitleErrors, regionErrors, districtErrors, healthSystemErrors, officePositionErrors]
        // .some(arr => arr.length > 0);
        return true;
    }

    const navigateSignin = () => {
        props.navigation.navigate('Signin');
    }

    const parseUserDetails = () => {
        const userDetails = {
            "email": user.email,
            "password": user.password,
            "cpassword": user.cpassword,
            "main_user": {
                "title": "",
                "surname": user.lastname,
                "firstname": user.firstname,
                "sex": user.sex,
                "phone1": user.phone1,
                "phone2": user.phone2,
                "is_trained_frontline": user.is_trained_frontline,
                "cohort_number_frontline": parseInt(user.cohort_number_frontline),
                "yr_completed_frontline": user.yr_completed_frontline,
                "institution_enrolled_at_frontline": user.institution_enrolled_at_frontline,
                "job_title_at_enroll_frontline": user.job_title_at_enroll_frontline,
                "is_trained_intermediate": user.is_trained_intermediate,
                "cohort_number_intermediate": parseInt(user.cohort_number_intermediate),
                "yr_completed_intermediate": isEmpty(user.yr_completed_intermediate) ? user.yr_completed_intermediate : '2020-08-31',
                "institution_enrolled_at_intermediate": user.institution_enrolled_at_intermediate,
                "job_title_at_enroll_intermediate": user.job_title_at_enroll_intermediate,
                "is_trained_advanced": user.is_trained_advanced,
                "cohort_number_advanced": parseInt(user.cohort_number_advanced),
                "yr_completed_advanced": isEmpty(user.yr_completed_advanced) ? user.yr_completed_advanced : '2020-08-31',
                "institution_enrolled_at_advanced": user.institution_enrolled_at_advanced,
                "image": null,
                "email_status": user.email_status,
                "job_title_at_enroll_advanced": user.job_title_at_enroll_advanced
            },
            "job_to_user": [{
                "current_institution": user.job_to_user.current_institution,
                "job_title": user.job_to_user.job_title,
                "region": 1,
                "district": 1,
                "level_of_health_system": 1,
                "employment_status": "",
                "is_current": user.job_to_user.is_current,
                "longitude": user.job_to_user.longitude,
                "latitude": user.job_to_user.latitude
            }]
        }
        return userDetails;
    }

    return (
        <View style={styles.signupContainer}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <LogoComponent logoText="Signup"/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputWithIconView}>
                <View style={[styles.emailInputView]}>
                    <FormInputComponent label="Current Institution" onChangeText={setCurrentInstitution} invalid={errors.currentInstitutionErrors.length > 0} value={user.job_to_user[0].current_institution}/>
                    {errors.currentInstitutionErrors.length > 0 && <HelperTextComponent text={errors.currentInstitutionErrors[0]} invalid/>}
                </View>
                <MapPreviewComponent 
                    selected={isUserOfficeLocationSet()} 
                    onPress={navigateMapView} 
                    invalid={errors.officePositionErrors.length > 0}
                    mapPreviewStyle={errors.currentInstitutionErrors.length > 0 ? {marginBottom: '8%'} : {}}
                />
            </View> 
            <View style={styles.formInputView}>
                <FormInputComponent label="Current Job Title" onChangeText={setCurrentJobTitle} invalid={errors.jobTitleErrors.length > 0} value={user.job_to_user[0].job_title}/>
                {errors.jobTitleErrors.length > 0 && <HelperTextComponent text={errors.jobTitleErrors[0]} invalid/>}
            </View>
            <View style={styles.formInputView}>
            <Text style={styles.pickerText}>Current Region</Text>
                <View style={styles.pickerView}>
                <Picker onValueChange={setCurrentRegion} selectedValue={user.job_to_user[0].region} mode="dialog">
                    <Picker.Item label="" value={null}/>
                    {
                        RegionList.map(reg => <Picker.Item key={reg.id} label={reg.name} value={reg.id}/>)
                    }                    
                </Picker>
                </View>
            </View>
            <View style={styles.formInputView}>
            <Text style={styles.pickerText}>Current District</Text>
                <DropdownComponent items={getDistrictListByRegion(selectedRegion)} selectText="" selectedItems={[user.job_to_user[0].district]} onSelectedItemsChange={(selectedItems) => setCurrentDistrict(selectedItems[0])} single searchPlaceholderText="Select a district" />
            </View>
            <View style={styles.formInputView}>
                <Text style={styles.pickerText}>Level of Health System</Text>
                <View style={styles.pickerView}>
                <Picker onValueChange={setLevelOfHealthSystem} selectedValue={user.job_to_user[0].level_of_health_system} mode="dropdown">
                    <Picker.Item label="" value={null}/>
                    {
                        levelOfHSList.map(healthSys => <Picker.Item key={healthSys.id} label={healthSys.name} value={healthSys.id}/>)
                    }                    
                </Picker>
                </View>
            </View>
            <View>
                <ButtonComponent title="Sign up" onPress={handleSubmit} buttonContainerStyle={styles.buttonComponent}/>
                <LinkTextComponent preText="Already have an account?" actionText="Login" onPress={navigateSignin}/>
            </View>
            </ScrollView>
        </View>
    );
}
//TODO add validation for current job details

export default SignUpWithMapScreen;

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
        justifyContent: 'flex-start'
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
        marginTop: 30,
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
        borderWidth: 1,       
        height: 50,
        justifyContent: 'center' 
    },
    pickerText: {
        fontSize: 15,
        marginBottom: 5
    },
    
});