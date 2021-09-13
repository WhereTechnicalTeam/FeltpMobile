import React from 'react';
import { StyleSheet, View } from 'react-native';
import AvatarComponent from '@components/avatar/AvatarComponent';
import BadgeComponent from '@components/badge/BadgeComponent';
import { colors } from '@theme/colors';

const CustomCalloutComponent = (props) => {
    const {memberImage, level, } = props;

    return (
        <View style={[styles.calloutView, styles.shadow]}>
            <AvatarComponent avatarContainerStyle={styles.avatar} src={memberImage}/>
            <View style={styles.badgeView}>
            <BadgeComponent text={level} badgeContainerStyle={{backgroundColor: getBadgeBackground(level)}}/>
            </View>
        </View>
    );
}

const getBadgeBackground = (level) => {
    let bgColor = colors.grey[0]
    switch(level) {
        case "FL": bgColor = colors.accents[0];
        break;
        case "IM": bgColor =  colors.accents[1];
        break;
        case "AD": bgColor = colors.accents[2]
    }
    return bgColor;
}

export default CustomCalloutComponent;

const styles = StyleSheet.create({
    calloutView: {
        flexDirection: 'row',
        width: 80,
        height: 40,
        borderRadius: 20,
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
        backgroundColor: colors.lightPrimary
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginRight: 5,
        alignSelf: 'center'
    },
    badgeView: {
        height: 30,
        width: 35,
        alignSelf: 'flex-end'
    }
});