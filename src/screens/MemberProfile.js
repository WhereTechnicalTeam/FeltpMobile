import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, ScrollView, StatusBar} from 'react-native';

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import ProfileTextComponent from '@components/profile-text/ProfileTextComponent';
import { colors } from '@theme/colors';
import { isDefined } from '@utils/validation';
import { safeConvertToString } from '@utils/helperFunctions';
import { getDistrictById, getRegionById } from '@utils/helperFunctions';

const MemberProfileScreen = (props) => {
    const [member, setMember] = useState({
            main_user: {
                firstname: "",
                surname: "",
                is_trained_frontline: false,
                cohort_number_frontline: '',
                yr_completed_frontline: '',
                institution_enrolled_at_frontline: '',
                job_title_at_enroll_frontline: '',
                is_trained_intermediate: false,
                yr_completed_intermediate: '',
                institution_enrolled_at_intermediate: '',
                job_title_at_enroll_intermediate: '',
                cohort_number_intermediate: '',
                is_trained_advanced: false,
                cohort_number_advanced: '',
                yr_completed_advanced: '',
                institution_enrolled_at_advanced: '',
                job_title_at_enroll_advanced: ''
            },
            job_to_user: [
                {
                    current_institution: "",
                    district: null,
                    employment_status: "",
                    is_current: "Yes",
                    job_title: "",
                    latitude: null,
                    level_of_health_system: null,
                    longitude: null,
                    region: null,
                }
            ]
    });

    useEffect(() => {
        setMember(props.route.params?.member);
        console.log("member", props.route.params.member);
    }, [props.route.params?.member]);

    const navigateBack = () => {
        props.navigation.navigate("MemberList");
    }

    return (
        <View style={styles.memberProfileContainer}>
            <View style={styles.header}>
                <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.white} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                <Text style={styles.nameText}>{`${safeConvertToString(member.main_user.firstname)} ${safeConvertToString(member.main_user.surname)}`}</Text>
                <Text style={styles.titleText}>{member.job_to_user[0].job_title}</Text>
                <Text style={styles.locationText}>{getDistrictById(member.job_to_user[0].district)}, {getRegionById(member.job_to_user[0].region)}</Text>
            </View>
            <View style={[styles.mainOverlay, styles.shadow]}>
                <View style={[styles.imageView, styles.shadow]}>
                    <Image source={require('@assets/man.jpg')} style={styles.image}/>
                </View>
                <ScrollView contentContainerStyle={styles.overlayContentView} showsVerticalScrollIndicator={false}>
                    <View style={styles.sectionView}>
                        <Text style={styles.sectionTitle}>Personal Info</Text>
                        <View style={[styles.cardView, styles.shadow]}>
                            <ProfileTextComponent label="Email" text={member.email} />
                            <ProfileTextComponent label="Gender" text={member.main_user.sex} />
                            <ProfileTextComponent label="Primary Phone number" text={member.main_user.phone1} />
                            <ProfileTextComponent label="Secondary Phone number" text={member.main_user.phone2} />
                        </View>
                    </View>
                    <View style={styles.sectionView}>
                        <Text style={styles.sectionTitle}>Frontline Training Info</Text>
                        <View style={[styles.cardView, styles.shadow]}>
                            <ProfileTextComponent label="Trained in Frontline" text={member.main_user.is_trained_frontline} />
                            <ProfileTextComponent label="Name of Institution" text={member.main_user.institution_enrolled_at_frontline} />
                            <ProfileTextComponent label="Job Title" text={member.main_user.job_title_at_enroll_frontline} />
                            <ProfileTextComponent label="Cohort Number" text={member.main_user.cohort_number_frontline} />
                            <ProfileTextComponent label="Year of Completion" text={member.main_user.yr_completed_frontline} />
                        </View>
                    </View>
                    <View style={styles.sectionView}>
                        <Text style={styles.sectionTitle}>Intermediate Training Info</Text>
                        <View style={[styles.cardView, styles.shadow]}>
                            <ProfileTextComponent label="Trained in Intermediate" text={member.main_user.is_trained_intermediate} />
                            <ProfileTextComponent label="Name of Institution" text={member.main_user.institution_enrolled_at_intermediate} />
                            <ProfileTextComponent label="Job Title" text={member.main_user.job_title_at_enroll_intermediate} />
                            <ProfileTextComponent label="Cohort Number" text={member.main_user.cohort_number_intermediate} />
                            <ProfileTextComponent label="Year of Completion" text={member.main_user.yr_completed_intermediate} />
                        </View>
                    </View>
                    <View style={styles.sectionView}>
                        <Text style={styles.sectionTitle}>Advanced Training Info</Text>
                        <View style={[styles.cardView, styles.shadow]}>
                            <ProfileTextComponent label="Trained in Advanced" text={member.main_user.is_trained_advanced} />
                            <ProfileTextComponent label="Name of Institution" text={member.main_user.institution_enrolled_at_advanced} />
                            <ProfileTextComponent label="Job Title" text={member.main_user.job_title_at_enroll_advanced} />
                            <ProfileTextComponent label="Cohort Number" text={member.main_user.cohort_number_advanced} />
                            <ProfileTextComponent label="Year of Completion" text={member.main_user.yr_completed_advanced} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default MemberProfileScreen;

const styles = StyleSheet.create({
    memberProfileContainer: {
        flex: 1,
        backgroundColor: colors.lightPrimary,
        paddingTop: 10,
    },
    iconButtonComponent: {
        backgroundColor: colors.lightPrimary
    },
    mainOverlay: {
        flex: 2,
        backgroundColor: colors.white,
        marginTop: 50,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40
    },
    nameText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white
    },
    titleText: {
        color: colors.white,
        textAlign: 'center',
        marginTop: 5
    },
    locationText: {
        textAlign: 'center',
        color: colors.secondaryBlack,
        marginBottom: 10
    },
    imageView: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginTop: -40,
        borderRadius: 10
    },
    image: {
        width: '100%',
        resizeMode: 'cover',
        height: 80, 
        borderRadius: 10
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
        backgroundColor: colors.white
    },
    overlayContentView: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    sectionTitle: {
        marginBottom: 10,
        color: colors.secondaryBlack
    }, 
    cardView: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    sectionView: {
        marginBottom: 20
    }
});