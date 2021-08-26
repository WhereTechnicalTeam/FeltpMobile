import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@theme/colors';

const ProfileTextComponent = (props) => {
    const {label, text} = props;

    return (
        <View style={styles.profileTextContainer}>
            <View style={styles.profileTextView}>
                <Text style={styles.profileLabel}>{label}</Text>
                <Text style={styles.profileText}>{text}</Text>
            </View>
        </View>
    );
}

export default ProfileTextComponent;

const styles = StyleSheet.create({
    profileTextContainer: {
        width: '100%',
        marginBottom: 10
    },
    profileTextView: {
        justifyContent: 'space-between'
    },
    profileLabel: {
        fontSize: 11,
        color: colors.secondaryBlack,
    },
    profileText: {
        fontSize: 17
    }
});