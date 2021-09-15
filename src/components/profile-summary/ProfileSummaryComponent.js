import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AvatarComponent from '@components/avatar/AvatarComponent';
import BadgeComponent from '@components/badge/BadgeComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import { colors } from '@theme/colors';

const ProfileSummaryComponent = (props) => {

    const { member: {photo, firstname, surname, region, district, jobTitle, level}, onChatPress, onProfilePress } = props;
    return (
        <View style={[styles.profileSummaryContainer, styles.shadow]}>
            <Text style={styles.profileHeading}>Personal info</Text>
            <View style={styles.profileSummaryContent}>
            <View style={styles.profileLeft}>
                <AvatarComponent src={photo} avatarContainerStyle={styles.avatar}/>
                <BadgeComponent text={level}/>
            </View>
            <View style={styles.profileRight}>
                <View style={styles.profileTextView}>
                    <Text style={styles.profileNameText}>{`${firstname} ${surname}`}</Text>
                    <Text style={styles.profileTitleText}>Managing Director</Text>
                    <Text style={styles.profileRegionText}>{`Ablemkuma South, Greater Accra`}</Text>
                </View>                
                <View style={styles.iconButtonView}>
                    <IconButtonComponent icon="eye" onPress={onProfilePress} color={colors.white} iconButtonStyle={[styles.iconButton, {backgroundColor: colors.primaryGreen}]} size={24}/>
                    <IconButtonComponent icon="chatbubbles" onPress={onChatPress} color={colors.white} iconButtonStyle={[styles.iconButton, {backgroundColor: colors.lightPrimary}]} size={24}/>
                </View>
            </View>
            </View>
        </View>
    );
}

export default ProfileSummaryComponent;

const styles = StyleSheet.create({
    profileSummaryContainer: {
        backgroundColor: colors.white,
        height: '40%',
        borderRadius: 10,
        width: '100%',
        padding: 20,
    },
    profileHeading: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 20
    },
    profileSummaryContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    profileLeft: {
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileRight: {
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
    profileTextView: {
        marginBottom: 15
    },
    profileNameText: {
        fontSize: 20,
        fontWeight: '600'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 15,
    },
    iconButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    profileRegionText: {
        fontSize: 13
    },
    profileTitleText: {
        fontSize: 18,
        fontWeight: '400'
    }
});