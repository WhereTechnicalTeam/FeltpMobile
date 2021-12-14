import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';
import { findUserByEmail } from '@api/userApi';
import ToastComponent from '@components/toast/ToastComponent';
import { safeConvertToString } from '@utils/helperFunctions';
import { isDefined } from '@utils/validation';

const UserProfileScreen = (props) => {
    const [user, setUser] = useState();
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        (async () => {
            try {
                let storedUser = await AsyncStorage.getItem('userDetails');
                console.log("stored user:", storedUser)
                storedUser = JSON.parse(storedUser);
                setUser(storedUser);
            } catch (err) {
                console.warn("Error fetching stored user:", err)
            }
        })();
    }, []);

    const navigateEditProfile = () => {
        props.navigation.navigate('EditProfile');
    }

    const handleRefresh = async() => {
        setRefresh(true);
        await fetchUserDetails();
        setRefresh(false);
    }

    const fetchUserDetails = async() => {
        try {
            const response = await findUserByEmail(user.email);
            console.log("email: ", user.email);
            if(response.status === 200) {
                console.log("user details", response.alldata[0]);
                const fetchedUser = {...response.alldata[0], job_to_user: [response.alldata[0].job_to_user]}
                setUser(fetchedUser);
                await AsyncStorage.setItem("userDetails", JSON.stringify(fetchedUser));
            } else {
                ToastComponent.show("Failed to fetch user details", {timeOut: 3500, level: 'failure'})
            }
        } catch(err) {
            console.log("Error fetching user details:", err);
        }
    }

    return (
        <View style={styles.profileContainer}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refresh}/>}>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Email" text={isDefined(user) ? safeConvertToString(user.email) : ""} />
                <ProfileTextComponent label="Gender" text={isDefined(user) ? safeConvertToString(user.main_user.sex) : ""} />
                <ProfileTextComponent label="Primary Phone number" text={isDefined(user) ? safeConvertToString(user.main_user.phone1) : ""} />
                <ProfileTextComponent label="Secondary Phone number" text={isDefined(user) ? safeConvertToString(user.main_user.phone2) : ""} />            
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Frontline" text={isDefined(user) ? safeConvertToString(user.main_user.is_trained_frontline) : ""} />
                <ProfileTextComponent label="Name of Institution" text={isDefined(user) ? safeConvertToString(user.main_user.institution_enrolled_at_frontline) : ""} />
                <ProfileTextComponent label="Job Title" text={isDefined(user) ? safeConvertToString(user.main_user.job_title_at_enroll_frontline) : ""} />
                <ProfileTextComponent label="Cohort Number" text={isDefined(user) ? safeConvertToString(user.main_user.cohort_number_frontline) : ""} />
                <ProfileTextComponent label="Year of Completion" text={isDefined(user) ? safeConvertToString(user.main_user.yr_completed_frontline) : ""} />
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Intermediate" text={isDefined(user) ? safeConvertToString(user.main_user.is_trained_intermediate) : ""} />
                <ProfileTextComponent label="Name of Institution" text={isDefined(user) ? safeConvertToString(user.main_user.institution_enrolled_at_intermediate) : ""} />
                <ProfileTextComponent label="Job Title" text={isDefined(user) ? safeConvertToString(user.main_user.job_title_at_enroll_intermediate) : ""} />
                <ProfileTextComponent label="Cohort Number" text={isDefined(user) ? safeConvertToString(user.main_user.cohort_number_intermediate) : ""} />
                <ProfileTextComponent label="Year of Completion" text={isDefined(user) ? safeConvertToString(user.main_user.yr_completed_intermediate) : ""} />
            </View>
            <View style={[styles.cardContainer, styles.shadow]}>
                <ProfileTextComponent label="Trained in Advanced" text={isDefined(user) ? safeConvertToString(user.main_user.is_trained_advanced) : ""} />
                <ProfileTextComponent label="Name of Institution" text={isDefined(user) ? safeConvertToString(user.main_user.institution_enrolled_at_advanced) : ""} />
                <ProfileTextComponent label="Job Title" text={isDefined(user) ? safeConvertToString(user.main_user.job_title_at_enroll_advanced) : ""} />
                <ProfileTextComponent label="Cohort Number" text={isDefined(user) ? safeConvertToString(user.main_user.cohort_number_advanced) : ""} />
                <ProfileTextComponent label="Year of Completion" text={isDefined(user) ? safeConvertToString(user.main_user.yr_completed_advanced) : ""} />
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