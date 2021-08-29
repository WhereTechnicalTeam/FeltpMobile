import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';

const UserProfileScreen = (props) => {
    const [user, setUser] = useState({
        main_user: {
            firstname: null,
            surname: null,
            is_trained_frontline: null,
            cohort_number_frontline: null,
            yr_completed_frontline: null,
            institution_enrolled_at_frontline: null,
            job_title_at_enroll_frontline: null,
            is_trained_intermediate: false,
            yr_completed_intermediate: null,
            institution_enrolled_at_intermediate: null,
            job_title_at_enroll_intermediate: null,
            cohort_number_intermediate: null,
            is_trained_advanced: false,
            cohort_number_advanced: null,
            yr_completed_advanced: null,
            institution_enrolled_at_advanced: null,
            job_title_at_enroll_advanced: null
        },
        job_to_user: [
            {
                current_institution: null,
                district: null,
                employment_status: null,
                is_current: "Yes",
                job_title: null,
                latitude: null,
                level_of_health_system: null,
                longitude: null,
                region: null,
            }
        ]
    });
    
    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.getItem('userDetails')
                .then(storedUser => {
                    setUser(JSON.parse(storedUser));
                    console.log('user profile', user);
                });                
            } catch(err) {
                console.warn("Error retrieving user details:", err);
            }
        })();
    }, []);

    const navigateEditProfile = () => {
        props.navigation.navigate('EditProfile');
    }

    return (
        <View style={styles.profileContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Email" text={user.email} />
                <ProfileTextComponent label="Gender" text={user.main_user.sex} />
                <ProfileTextComponent label="Primary Phone number" text={user.main_user.phone1} />
                <ProfileTextComponent label="Secondary Phone number" text={user.main_user.phone2} />            
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Frontline" text={user.main_user.is_trained_frontline} />
                <ProfileTextComponent label="Name of Institution" text={user.main_user.institution_enrolled_at_frontline} />
                <ProfileTextComponent label="Job Title" text={user.main_user.job_title_at_enroll_frontline} />
                <ProfileTextComponent label="Cohort Number" text={user.main_user.cohort_number_frontline} />
                <ProfileTextComponent label="Year of Completion" text={user.main_user.yr_completed_frontline} />
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Intermediate" text={user.main_user.is_trained_intermediate} />
                <ProfileTextComponent label="Name of Institution" text={user.main_user.institution_enrolled_at_intermediate} />
                <ProfileTextComponent label="Job Title" text={user.main_user.job_title_at_enroll_intermediate} />
                <ProfileTextComponent label="Cohort Number" text={user.main_user.cohort_number_intermediate} />
                <ProfileTextComponent label="Year of Completion" text={user.main_user.yr_completed_intermediate} />
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Advanced" text={user.main_user.is_trained_advanced} />
                <ProfileTextComponent label="Name of Institution" text={user.main_user.institution_enrolled_at_advanced} />
                <ProfileTextComponent label="Job Title" text={user.main_user.job_title_at_enroll_advanced} />
                <ProfileTextComponent label="Cohort Number" text={user.main_user.cohort_number_advanced} />
                <ProfileTextComponent label="Year of Completion" text={user.main_user.yr_completed_advanced} />
            </View>
        </ScrollView>
        <View style={styles.fabView}>
            <IconButtonComponent icon="pencil" size={24} color={colors.white} iconButtonStyle={{...styles.shadow, ...styles.fab}} onPress={navigateEditProfile}/>
        </View>
        </View>
    );
}

export default UserProfileScreen;

const styles = StyleSheet.create({
    profileContainer: {
        paddingVertical: 10,
        position: 'relative',
        flex: 1
    },
    cardContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        marginTop: 20
        // borderRadius: 5,
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
})