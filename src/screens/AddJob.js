import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, ScrollView } from 'react-native';
import FormInputComponent from '@components/input/FormInputComponent';
import MapPreviewComponent from '@components/map-preview/MapPreviewComponent';
import { Picker } from '@react-native-picker/picker';
import { levelOfHSList, RegionList } from '@utils/constants';
import DropdownComponent from '@components/dropdown/DropdownComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import { colors } from '@theme/colors';
import { isAlphaTextValid, isDefined, isTextValid, isEmpty, isNumericTextValid } from '@utils/validation';
import { safeConvertToString } from '@utils/helperFunctions';
import ToastComponent from '@components/toast/ToastComponent';
import HelperTextComponent from '@components/helper-text/HelperTextComponent';
import { getDistrictListByRegion } from '@utils/helperFunctions';
import { updateJobHistory } from '@api/userApi';

const AddJobScreen = (props) => {
    const {user, modalVisible, handleCancel, token, navigateMapView, currentJobProps} = props;
    const [currentJob, setCurrentJob] = useState({
            current_institution: null,
            job_title: null,
            region: null,
            district: null,
            level_of_health_system: null,
            longitude: null,
            latitude: null,
            is_current: 'Yes',
            employment_status: "full-time"
    });
    const [selectedRegion, setSelectedRegion] = useState('');
    const [errors, setErrors] = useState({
        officePositionErrors: [],
        currentInstitutionErrors: [],
        jobTitleErrors: [],
        regionErrors: [],
        districtErrors: [],
        healthSystemErrors: []
    }); 

    // useEffect(() => {
    //     if(isDefined(currentJobProps)) {
    //         setCurrentJob(currentJobProps);
    //         setSelectedRegion(currentJobProps.region);
    //     }
    //     console.log(currentJobProps);
    // }, [currentJobProps]);

    const updateIsCurrent = (jobToUser) => {
        return jobToUser.map(job => ({...job, is_current: 'No'}));
    }

    const handleSubmit = async() => {
        console.log(currentJob);
        try {
            if(validateUserDetails()) {
                const jobUpdate = {
                    id: user.main_user.id, 
                    email: user.email, 
                    job_to_user: [
                        ...updateIsCurrent(user.job_to_user),
                        currentJob
                ]};
                console.log("jobUpdate:", jobUpdate);
            const response = await updateJobHistory(token, user.main_user.id, jobUpdate);
            if(response.status == 200) {
                ToastComponent.show("Job details updated!", {timeOut: 3500, level: "success"});
                handleCancel();
            } else {
                ToastComponent.show("Job details update failed", {timeOut: 3500, level: "failure"});
            }
            } else {
                ToastComponent.show("Invalid job details", {timeOut: 3500, level: "failure"});
            }     
        } catch(err) {
            console.warn("Error updating job details:", err);
        }
    }

    const validateUserDetails = () => {
        const currentInstitutionErrors = isTextValid(currentJob.current_institution);
        const jobTitleErrors = isAlphaTextValid(currentJob.job_title);
        const regionErrors = isNumericTextValid(currentJob.region);
        const districtErrors = isNumericTextValid(currentJob.district);
        const healthSystemErrors = isNumericTextValid(currentJob.level_of_health_system);
        // const officePositionErrors = [...isTextValid(currentJob.latitude, 1), ...isTextValid(currentJob.longitude, 1)];
        setErrors({currentInstitutionErrors, jobTitleErrors, regionErrors, districtErrors, healthSystemErrors, officePositionErrors: []});
        console.log(errors);
        return ![currentInstitutionErrors, jobTitleErrors, regionErrors, districtErrors, healthSystemErrors]
        .some(arr => arr.length > 0);
    }

    const setCurrentInstitution = (current_institution) => {
       setCurrentJob(prevJob => ({...prevJob, current_institution}));
    }

    const setCurrentJobTitle = (job_title) => {
        setCurrentJob(prevJob => ({...prevJob, job_title}));
    }

    const setCurrentRegion = (region) => {
        setCurrentJob(prevJob => ({...prevJob, region}));
        if(isDefined(region))
        setSelectedRegion(RegionList.filter(reg => reg.id == region)[0].name)
        else {
            setSelectedRegion(safeConvertToString(region));
            setCurrentDistrict(null);
        }
    }

    const setCurrentDistrict = (district) => {
        setCurrentJob(prevJob => ({...prevJob, district}));
    }

    const setLevelOfHealthSystem = (level_of_health_system) => {
        setCurrentJob(prevJob => ({...prevJob, level_of_health_system}));
    }

    const setOfficePosition = (officePosition) => {
        setCurrentJob(prevJob => ({...prevJob, longitude: officePosition.longitude, latitude: officePosition.latitude}));
    }

    const isUserOfficeLocationSet = () => {
        const {is_current, latitude, longitude} = currentJob;
        return is_current == 'Yes' && (isDefined(latitude) && !isEmpty(latitude)) && (isDefined(longitude) && !isEmpty(longitude));
    }

    return (
            <Modal animationType="slide"
            visible={modalVisible}
        transparent={true}>
                <ScrollView contentContainerStyle={[styles.container, styles.shadow]} showsVerticalScrollIndicator={false}> 
                    <View>
                        <Text style={styles.modalTitle}>Current Job Details</Text>
                    </View>
                    <View style={[styles.inputWithIconView, styles.inputView]}>
                        <View style={styles.inputWithIcon}>
                        <FormInputComponent label="Name of Institution" onChangeText={setCurrentInstitution} value={currentJob.current_institution} invalid={errors.currentInstitutionErrors.length > 0}/>
                        {errors.currentInstitutionErrors.length > 0 && <HelperTextComponent text={errors.currentInstitutionErrors[0]} invalid />}
                        </View>
                        <MapPreviewComponent
                            selected={isUserOfficeLocationSet()}
                            // onPress={() => navigateMapView(currentJob)}
                            invalid={errors.officePositionErrors.length > 0}
                            mapPreviewStyle={errors.currentInstitutionErrors.length > 0 ? {marginBottom: '8%'} : {}}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <FormInputComponent label="Job Title" value={currentJob.job_title} invalid={errors.jobTitleErrors.length > 0} onChangeText={setCurrentJobTitle}/>
                        {errors.jobTitleErrors.length > 0 && <HelperTextComponent text={errors.jobTitleErrors[0]} invalid/>}
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.pickerText}>Region</Text>
                        <View style={styles.pickerView}>
                        <Picker onValueChange={setCurrentRegion} selectedValue={currentJob.region} mode="dialog">
                            <Picker.Item label="" value={null} />
                            {
                                RegionList.map(r => <Picker.Item key={r.id} label={r.name} value={r.id}/>)
                            }
                        </Picker>                            
                        </View>
                        {errors.regionErrors.length > 0 && <HelperTextComponent text={errors.regionErrors[0]} invalid/>}
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.pickerText}>District</Text>
                        <DropdownComponent items={getDistrictListByRegion(selectedRegion)} selectedItems={[currentJob.district]} selectedText="" onSelectedItemsChange={(selectedItems) => setCurrentDistrict(selectedItems[0])} single searchPlaceholderText="Select a district" />
                        {errors.districtErrors.length > 0 && <HelperTextComponent text={errors.districtErrors[0]} invalid/>}
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.pickerText}>Level of Health System</Text>
                        <View style={styles.pickerView}>
                            <Picker onValueChange={setLevelOfHealthSystem} selectedValue={currentJob.level_of_health_system} mode="dropdown">
                                <Picker.Item value={null} label="" />
                                {
                                    levelOfHSList.map(hs => <Picker.Item value={hs.id} label={hs.name} key={hs.id} />)
                                }
                            </Picker>
                        </View>
                        {errors.healthSystemErrors.length > 0 && <HelperTextComponent text={errors.healthSystemErrors[0]} invalid/>}
                    </View>   
                    <View style={styles.buttonView}>
                        <ButtonComponent title="Cancel" buttonContainerStyle={styles.button} onPress={handleCancel}/>
                        <ButtonComponent title="Save" buttonContainerStyle={[styles.button, {backgroundColor: colors.primaryGreen}]} onPress={handleSubmit}/>
                    </View>
                </ScrollView>
            </Modal>
    )
}

export default AddJobScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: colors.white,
        alignSelf: 'center',
        width: '90%',
        marginTop: 25,
        position: 'relative',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    button: {
        width: '30%'
    },
    inputWithIconView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    inputWithIcon: {
        width: '80%'
    },
    inputView: {
        marginBottom: 15
    },
    pickerView: {
        borderWidth: 0.8,
        borderColor: colors.secondaryBlack,
        borderRadius: 5,
        height: 50,
        justifyContent: 'center' 
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: colors.white
   },
    pickerText: {
        fontSize: 15,
        marginBottom: 5
    }
});