import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import SpinnerComponent from '@components/spinner/SpinnerComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors } from '@theme/colors';
import MapPreviewComponent from '@components/map-preview/MapPreviewComponent';
import { updateUser } from '@api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastComponent from '@components/toast/ToastComponent';
import { levelOfHSList, RegionList } from '@utils/constants';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import { Picker } from '@react-native-picker/picker';
import DropdownComponent from '@components/dropdown/DropdownComponent';
import { getDistrictListByRegion, safeConvertToString } from '@utils/helperFunctions';
import { isDefined, isEmpty } from '@utils/validation';

const EditProfile3Screen = (props) => {

    const [user, setUser] = useState({
        job_to_user: [{
            current_institution: null,
            job_title: null,
            region: null,
            district: null,
            level_of_health_system: null,
            longitude: null,
            latitude: null,
            is_current: 'Yes'
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
            console.warn("Error fetching prev screen edit user details:", err)
        }
    }, []);

    useEffect(() => {
        if(props.route.params?.officeMarkerPosition) {
            console.log("office marker", props.route.params.officeMarkerPosition);
            setOfficePosition(props.route.params.officeMarkerPosition);
        }
    }, [props.route.params?.officeMarkerPosition]);

    const navigateBack = () => {
        props.navigation.goBack();
    }

    const navigateMapView = () => {
        props.navigation.navigate('Auth', {
            screen: 'MapView',
            params: {
                callingScreen: 'EditProfile3'
            }
        });
    }

    const navigateUserProfile = () => {
        props.navigation.navigate('UserProfile');
    }

    const handleSubmit = async() => {
        console.log("user update", user);
        try {
            if(validateUserDetails()) {
                setLoading(true);
                let response = await updateUser(user, user.main_user.id);
                setLoading(false);
                if(response.status === 200) {
                    ToastComponent.show("Profile updated", {timeOut: 3500, level: 'success'});
                    await AsyncStorage.setItem("userDetails", JSON.stringify(user));
                    navigateUserProfile();
                } else {
                    ToastComponent.show("Profile update failed", {timeOut: 3500, level: 'failure'});
                }
            } else {
                ToastComponent.show("Invalid Details", {timeOut: 3500, level: 'failure'});
            }
        } catch(error) {
            console.error("Error updating user:", error);
        }
    }

    const isUserOfficeLocationSet = () => {
        const {is_current, latitude, longitude} = user.job_to_user[0];
        return is_current == 'Yes' && (isDefined(latitude) && !isEmpty(latitude)) && (isDefined(longitude) && !isEmpty(longitude));
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
        //validate location details (if current institution is set, job title and location must be set)
        //if region is set, district must be set
        return true;
    }

    const parseUserDetails = () => {
        let user = {...prevUserDetails, ...currentUserDetails};
        const userDetails = {
            "email": user.email,
            "password": user.password,
            "cpassword": user.confirmPassword,
            "main_user": {
                "title": "",
                "surname": user.surname,
                "firstname": user.firstname,
                "sex": user.gender,
                "phone1": user.primaryPhone,
                "is_trained_frontline": user.frontlineExpanded,
                "cohort_number_frontline": "",
                "yr_completed_frontline": user.frontlineDetails.yearCompleted,
                "institution_enrolled_at_frontline": user.frontlineDetails.intitution,
                "job_title_at_enroll_frontline": "",
                "is_trained_intermediate": user.intermediateExpanded,
                "cohort_number_intermediate": "",
                "yr_completed_intermediate": user.intermediateDetails.yearCompleted,
                "institution_enrolled_at_intermediate": user.intermediateDetails.intitution,
                "job_title_at_enroll_intermediate": "",
                "is_trained_advanced": null,
                "cohort_number_advanced": user.advancedDetails.cohortNumber,
                "yr_completed_advanced": null,
                "institution_enrolled_at_advanced": "",
                "image": null,
                "email_status": user.emailStatus,
                "job_title_at_enroll_advanced": ""
            },
            "job_to_user": {
                "current_institution": user.currentInstitution,
                "job_title": user.currentJobTitle,
                "region": user.currentRegion,
                "district": user.currentDistrict,
                "level_of_health_system": user.levelOfHealthSystem,
                "employment_status": "",
                "is_current": "true",
                "longitude": officePosition.longitude,
                "latitude": officePosition.latitude
            }
        }
        return userDetails;
    }

    return (
        <View style={styles.signupContainer}>
            <Spinner visible={loading} customIndicator={<SpinnerComponent />}/>
            <View style={styles.logoComponentView}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
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
                <Picker onValueChange={setCurrentRegion} selectedValue={user.job_to_user[0].region} mode="dropdown">
                    <Picker.Item label="" value={null} />
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
                <ButtonComponent title="Update Profile" onPress={handleSubmit} buttonContainerStyle={styles.buttonComponent}/>
            </View>
            </ScrollView>
        </View>
    );
}

export default EditProfile3Screen;

const styles = StyleSheet.create({
    signupContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingBottom: 20,
        backgroundColor: colors.white
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
        marginTop: 30
    },
    iconButtonComponent: {
        backgroundColor: colors.white,
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
});