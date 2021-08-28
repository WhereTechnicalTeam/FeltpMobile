import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserJobHistory } from 'src/api/userApi';
import { isDefined } from 'src/utils/validation';
import ToastComponent from 'src/components/toast/ToastComponent';

const JobHistoryScreen = (props) => {
    const [jobHistory, setJobHistory] = useState([
        {
            id: 0,
            current_institution: "Ghana Health Service",
            job_title: "Junior Leader",
            region: "Bono",
            district: "Ada West",
            level_of_health_system: "Regional",
            longitude: null,
            latitude: null,
            is_current: 'Yes'
        }
    ]);
    const [user, setUser] = useState();

    useEffect(() => {
        try {
            (async() => {
                const storedUser = await AsyncStorage.getItem('userDetails');
                const token = await AsyncStorage.getItem('authToken');
                setUser(JSON.parse(storedUser));
                if(isDefined(user)) {
                    const response = await fetchUserJobHistory(token, user.main_user.id);
                    if(response.status == 200) {
                        setJobHistory(response.job_to_user);
                        console.log("Job History response:", response);
                    } else ToastComponent.show("Failed to fetch job history", {timeOut: 3500, level: 'failure'})
                } else {
                    ToastComponent.show("Failed to fetch user job details", {timeOut: 3500, level: 'failure'})
                }
            })();
        } catch(err) {
            console.warn("Error setting up job history screen", err);
        }
    }, []);

    const renderJobDetails = ({item}) => (
        <View style={[styles.cardContainer, styles.shadow]}>
            <ProfileTextComponent label="Current Institution" text={item.current_institution} />
            <ProfileTextComponent label="Job Title" text={item.job_title} />
            <ProfileTextComponent label="Region" text={item.region} />
            <ProfileTextComponent label="District" text={item.district} />
            <ProfileTextComponent label="Level of Health System" text={item.level_of_health_system} />
            <ProfileTextComponent label="Is Current Job" text={item.is_current} />
        </View>        
    );

    return (
        <View style={styles.containerView}>
            <FlatList renderItem={renderJobDetails} keyExtractor={item => item.id.toString()} data={jobHistory} showsVerticalScrollIndicator={false}/>
            <View style={styles.fabView}>
                <IconButtonComponent icon="add" size={24} color={colors.white} iconButtonStyle={{...styles.shadow, ...styles.fab}}/>
            </View>
        </View>
    );
}

export default JobHistoryScreen;

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 20,
        position: 'relative',
        flex: 1
    },
    cardContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: colors.white,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    fabView: {
        bottom: 10,
        alignSelf: 'flex-end',
        right: 10,
        position: 'absolute'
    },
    fab: {
        backgroundColor: colors.primary,
        borderRadius: 25,
    }
});