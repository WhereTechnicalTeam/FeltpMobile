import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, Text, StyleSheet } from 'react-native';
import FormInputComponent from '@components/input/FormInputComponent';
import MapPreviewComponent from '@components/map-preview/MapPreviewComponent';
import { Picker } from '@react-native-picker/picker';
import { levelOfHSList, RegionList } from '@utils/constants';
import DropdownComponent from '@components/dropdown/DropdownComponent';
import ButtonComponent from '@components/button/ButtonComponent';

const AddJobScreen = (props) => {
    const {modalVisible} = props;
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
    
    useEffect(() => {
        try{
            (async () => {
                let storedUser = props.route.params?.user;
                storedUser = JSON.parse(storedUser);
                let incoming_job_to_user = isDefined(storedUser.job_to_user) ? previousUserDetails.job_to_user : []
                setUser(prevUser => {
                    let {job_to_user} = prevUser;
                    job_to_user = [...job_to_user, ...incoming_job_to_user]; //merge job_to_user
                    return {...storedUser, job_to_user}; 
                });     
            })();
        } catch (err) {
            console.warn("Error retrieving user details:", err);
        }
    }, []);

    const handleSubmit = () => {
        //validate job details
        //update is_current
        //make api call
        //update local user state and navigate to job history
    }

    // const setCurrentInstitution = (current_institution) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], current_institution};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    // }

    // const setCurrentJobTitle = (job_title) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], job_title};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    // }

    // const setCurrentRegion = (region) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], region};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    //     if(isDefined(region))
    //     setSelectedRegion(RegionList.filter(reg => reg.id == region)[0].name)
    //     else {
    //         setSelectedRegion(safeConvertToString(region));
    //         setCurrentDistrict(null);
    //     }
    // }

    // const setCurrentDistrict = (district) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], district};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    // }

    // const setLevelOfHealthSystem = (level_of_health_system) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], level_of_health_system};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    // }

    // const setOfficePosition = (officePosition) => {
    //     let {job_to_user} = user;
    //     job_to_user[0] = {...job_to_user[0], longitude: officePosition.longitude, latitude: officePosition.latitude};
    //     setUser(prevUser => ({...prevUser, job_to_user}));
    // }


    return (
        <View>
            <Modal animationType="slide"
        transparent={true}>
                <View>
                    <View>
                        <FormInputComponent label="Current Institution" />
                        <MapPreviewComponent />
                    </View>
                    <View>
                        <FormInputComponent label="Current Job Title" />
                    </View>
                    <View>
                        <Text>Current Region</Text>
                        <View>
                        <Picker>
                            <Picker.Item label="" value={null} />
                            {
                                RegionList.map(r => <Picker.Item key={r.id} label={r.name} value={r.id}/>)
                            }
                        </Picker>                            
                        </View>
                    </View>
                    <View>
                        <Text>Current District</Text>
                        <DropdownComponent items={[]} selectedItems={[]} selectedText="" onSelectedItemsChange={() => {}} />
                    </View>
                    <View>
                        <Text>Level of Health System</Text>
                        <View>
                            <Picker>
                                <Picker.Item value={null} label="" />
                                {
                                    levelOfHSList.map(hs => <Picker.Item value={hs.id} label={hs.name} key={hs.id} />)
                                }
                            </Picker>
                        </View>
                    </View>   
                    <View>
                        <ButtonComponent title="Cancel" />
                        <ButtonComponent title="Save" />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default AddJobScreen;

const styles = StyleSheet.create({

});