import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

const BadgeComponent = (props) => {
    const {text, badgeContainerStyle} = props;

    return (
        <View style={[styles.badgeView, badgeContainerStyle]}>
            <Text style={styles.badgeText}>{text}</Text>
        </View>
    );
}

export default BadgeComponent;

const styles = StyleSheet.create({
    badgeView: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 7,
        paddingVertical: 2,
        justifyContent: 'center'
    },
    badgeText: {
        textAlign: 'center',
        fontSize: 15,
        color: colors.white
    },
});